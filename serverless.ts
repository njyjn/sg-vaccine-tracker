import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'sg-vaccine-tracker',
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
        migrate: true,
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
        SGVTDev: [
          'sgvtDevKey'
        ]
      }
    ],
    usagePlan: [
      {
        SGVTDev: {
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
      }
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      COUNTS_TABLE: "sgvt-counts-${self:provider.stage}",
      STAT_URL: 'https://www.moh.gov.sg/covid-19/vaccination',
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
    ],
    stage: "${opt:stage, 'dev'}",
    // @ts-ignore
    region: "${opt:region, 'us-east-1'}",
  },
  // import the function via paths
  functions: {
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
        {
          http: {
            method: 'post',
            path: 'counts',
            cors: true,
            private: true,
          }
        }
      ]
    }
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
      }
    }
  }
};

module.exports = serverlessConfiguration;
