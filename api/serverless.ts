import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'sg-vaccine-tracker',
  variablesResolutionMode: '20210326',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    'serverless-offline': {
      httpPort: 3003,
    },
    // local dynamodb
    dynamodb: {
      stages: [
        'local'
      ],
      start: {
        image: 'sgvt-dynamodb-local',
        port: 8000,
        noStart: true,
        migrate: false,
        seed: true,
      },
      seed: {
        invites: {
          sources: [
            {
              table: "${self:provider.environment.COUNTS_TABLE}",
              sources: [
                'docker/dynamodb/seeds/counts.json'
              ]
            }
          ]
        }
      }
    }
  },
  plugins: [
    'serverless-webpack',
    'serverless-dynamodb-local',
    'serverless-offline',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    apiKeys: [
      {
        free: [
          "${self:provider.environment.API_KEY_NAME}-free"
        ]
      },
      {
        paid: [
          "${self:provider.environment.API_KEY_NAME}-paid"
        ]
      }
    ],
    usagePlan: [
      {
        free: {
          quota: {
            limit: 5000,
            offset: 2,
            period: 'MONTH'
          },
          throttle: {
            burstLimit: 5,
            rateLimit: 5
          }
        }
      },
      {
        paid: {
          quota: {
            limit: 50000,
            offset: 1,
            period: 'MONTH'
          },
          throttle: {
            burstLimit: 2000,
            rateLimit: 1000
          }
        }
      }
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      DEPLOY_STAGE: "${self:provider.stage}",
      COUNTS_TABLE: "sgvt-counts-${self:provider.stage}",
      STAT_URL: 'https://www.moh.gov.sg/covid-19/vaccination',
      API_KEY_NAME: "sgvt-${self:provider.stage}-key",
      NEW_DATAPOINT_TOPIC_NAME: "sgvt-newDatapointTopic-${self:provider.stage}",
      AWS_ACCOUNT_ID: {
        "Fn::Sub": "${AWS::AccountId}"
      },
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:Scan',
          'dynamodb:PutItem',
          'dynamodb:GetItem',
        ],
        Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.COUNTS_TABLE}",
      },
      {
        Effect: 'Allow',
        Action: [
          'sns:Publish'
        ],
        Resource: {
          "Fn::Sub": "arn:aws:sns:${AWS::Region}:${AWS::AccountId}:${self:provider.environment.NEW_DATAPOINT_TOPIC_NAME}",
        }
      },
      {
        Effect: 'Allow',
        Action: [
          'kms:Decrypt'
        ],
        Resource: {
          "Fn::GetAtt": ['KMSKey', 'Arn']
        }
      },
    ],
    stage: "${opt:stage, 'dev'}",
    // @ts-ignore
    region: "${opt:region, 'us-east-1'}",
  },
  // import the function via paths
  functions: {
    GetLatestCount: {
      handler: 'src/lambdas/http/getLatestCount.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'counts/latest',
            cors: true,
            // private: true,
          }
        }
      ]
    },
    GetAllCounts: {
      handler: 'src/lambdas/http/getAllCounts.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'counts',
            cors: true,
            private: true,
          }
        }
      ]
    },
    SyncLatestCount: {
      handler: 'src/lambdas/scheduler/syncLatestCount.handler',
      events: [
        // {
        //   http: {
        //     method: 'post',
        //     path: 'counts',
        //     cors: true,
        //     private: true,
        //   }
        // },
        {
          schedule: {
            rate: 'cron(0 12 * * ? *)',
            enabled: true,
          }
        }
      ]
    },
    SubscribeNewDatapointTopic: {
      environment: {
        SLACK_BOT_TOKEN: "${ssm(${self:provider.region}):sgvt-slack-bot-token}",
        SLACK_TEST_CHANNEL: "${ssm(${self:provider.region}):sgvt-slack-test-channel}",
        SLACK_NOTIFICATION_CHANNEL: "${(${self:provider.region})ssm:sgvt-slack-notification-channel}",
      },
      handler: 'src/lambdas/sns/subscribeNewDatapointTopic.handler',
      events: [
        {
          sns: {
            arn: {
              "Fn::Sub": "arn:aws:sns:${AWS::Region}:${AWS::AccountId}:${self:provider.environment.NEW_DATAPOINT_TOPIC_NAME}"
            },
            topicName: "${self:provider.environment.NEW_DATAPOINT_TOPIC_NAME}",
            filterPolicy: {
              channel: [
                'NewDatapoint'
              ]
            }
          }
        }
      ]
    },
  },
  resources: {
    Resources: {
      CountsDynamoDBTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: 'dateAsOf',
              AttributeType: 'S',
            },
            {
              AttributeName: 'type',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'dateAsOf',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'type',
              KeyType: 'RANGE',
            }
          ],
          BillingMode: 'PAY_PER_REQUEST',
          TableName: "${self:provider.environment.COUNTS_TABLE}"
        }
      },
      NewDatapointTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          DisplayName: 'New datapoint topic',
          TopicName: "${self:provider.environment.NEW_DATAPOINT_TOPIC_NAME}",
        }
      },
      KMSKey: {
        Type: 'AWS::KMS::Key',
        Properties: {
          Description: 'KMS key to encrypt secrets',
          KeyPolicy: {
            Version: '2012-10-17',
            Id: 'key-default-1',
            Statement: [
              {
                Sid: 'Allow administration of the key',
                Effect: 'Allow',
                Principal: {
                  AWS: {
                    "Fn::Sub": "arn:aws:iam::${AWS::AccountId}:root"
                  }
                },
                Action: [
                  'kms:*'
                ],
                Resource: '*',
              }
            ]
          }
        }
      },
      KMSKeyAlias: {
        Type: 'AWS::KMS::Alias',
        Properties: {
          AliasName: 'alias/sgvt-kmskey-${self:provider.stage}',
          TargetKeyId: {
            Ref: 'KMSKey'
          }
        }
      },
    }
  }
};

module.exports = serverlessConfiguration;
