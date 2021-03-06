import type { AWS } from '@serverless/typescript';
import { slsCorsOrigins, jwksUrl } from 'src/config';

const serverlessConfiguration: AWS = {
  service: 'sg-vaccine-tracker',
  variablesResolutionMode: '20210326',
  frameworkVersion: '2',
  custom: {
    cors: {
      origin: slsCorsOrigins,
      headers: [
        'Content-Type',
        'X-Amz-Date',
        'Authorization',
        'X-Api-Key',
        'X-Amz-Security-Token',
        'X-Amz-User-Agent',
      ],
      allowCredentials: false
    },
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
        host: "${env:DYNAMODB_HOST, 'localhost'}",
        port: 8000,
        noStart: true,
        migrate: true,
        seed: true,
        inMemory: true,
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
    },
    'serverless-offline-ssm': {
      stages: [
        'local'
      ]
    }
  },
  plugins: [
    'serverless-offline-ssm',
    'serverless-webpack',
    'serverless-dynamodb-local',
    'serverless-offline',
  ],
  package: {
    excludeDevDependencies: true,
    individually: true
  },
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
      COUNTS_TABLE: "sgvt-counts-${self:provider.stage}V2",
      STAT_URL: 'https://www.moh.gov.sg/covid-19/vaccination',
      API_KEY_NAME: "sgvt-${self:provider.stage}-key",
      NEW_DATAPOINT_TOPIC_NAME: "sgvt-newDatapointTopic-${self:provider.stage}",
      AWS_ACCOUNT_ID: {
        "Fn::Sub": "${AWS::AccountId}"
      },
      POPULATION_TOTAL: '5453600',
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:Scan',
          'dynamodb:PutItem',
          'dynamodb:GetItem',
          'dynamodb:Query',
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
    AuthWithCert: {
      environment: {
        JWKS_URL: jwksUrl
      },
      handler: 'src/lambdas/auth/customAuthWithCert.handler'
    },
    HealthCheck: {
      handler: 'src/lambdas/http/healthCheck.handler',
      events: [
        {
          http: {
            method: 'get',
            path: '/',
            cors: {
              Ref: "${self:custom.cors}"
            }
          }
        }
      ]
    },
    GetLatestCount: {
      handler: 'src/lambdas/http/getLatestCount.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'counts/latest',
            cors: {
              Ref: "${self:custom.cors}"
            },
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
            authorizer: {
              name: 'AuthWithCert'
            },
          }
        }
      ]
    },
    UpsertCounts: {
      handler: 'src/lambdas/http/upsertCounts.handler',
      events: [
        {
          http: {
            method: 'put',
            path: 'counts',
            cors: true,
            authorizer: {
              name: 'AuthWithCert'
            },
          }
        },
      ]
    },
    RecalculateAllHistoricals: {
      handler: 'src/lambdas/http/recalculateAllHistoricals.handler',
      events: [
        {
          http: {
            method: 'patch',
            path: 'counts/historicals',
            cors: true,
            authorizer: {
              name: 'AuthWithCert'
            },
          }
        },
      ]
    },
    SyncLatestCount: {
      handler: 'src/lambdas/scheduler/syncLatestCount.handler',
      events: [
        {
          http: {
            method: 'post',
            path: 'counts/sync',
            cors: true,
            authorizer: {
              name: 'AuthWithCert'
            },
          }
        },
        {
          schedule: {
            rate: 'cron(0 12 * * ? *)',
            enabled: false,
          }
        }
      ]
    },
    SubscribeNewDatapointTopic: {
      environment: {
        SLACK_BOT_TOKEN: "${ssm:sgvt-slack-bot-token}",
        SLACK_TEST_CHANNEL: "${ssm:sgvt-slack-test-channel}",
        SLACK_NOTIFICATION_CHANNEL: "${ssm:sgvt-slack-notification-channel}",
        TWITTER_CONSUMER_KEY: "${ssm:sgvt-twitter-api-key}",
        TWITTER_SECRET_KEY: "${ssm:sgvt-twitter-api-secret-key}",
        TWITTER_ACCESS_TOKEN_KEY: "${ssm:sgvt-twitter-access-token-key}",
        TWITTER_ACCESS_TOKEN_SECRET: "${ssm:sgvt-twitter-access-token-secret}",
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
      CountsDynamoDBTableV2: {
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
              AttributeName: 'type',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'dateAsOf',
              KeyType: 'RANGE',
            },
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
