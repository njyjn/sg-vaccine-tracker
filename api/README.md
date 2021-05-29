# SG Vaccine Tracker API

![unit test status](https://github.com/njyjn/sg-vaccine-tracker/actions/workflows/api.yml/badge.svg)

This component is a privately accessible API that scrapes data from MOH's vaccination portal on a daily basis. It consists of the following

- Daily scraper to read vaccination data from MOH
- API endpoints to manually override, get all counts, and get the latest count

It stores the data in the following format

```ts
interface Count {
    dateAsOf: string
    type: string
    value: number
}
```

## Serverless Architecture

This component is designed around the [serverless](https://www.serverless.com/) framework. The business logic is hosted on AWS Lambda, and connected to API Gateway. Data is stored in DynamoDB. Deployments are all done using the `serverless.ts` template file and automatically served by Amazon's CloudFormation platform.

### Business Logic

Business logic is found in the `src/logic` directory and is designed to be platform agnostic, meaning I can port out of AWS and the logic should still run without a hitch.

### Data Layer

Any interfacing with the data service, in this case AWS DynamoDB, is done in files within the `src/dataLayer` directory. They depend on platform agnostic type definitions in `src/models`.

### Notification Layer

An interface with the notification service, in this case AWS Simple Notification Service and Slack, can be done in files within the `src/notificationLayer` directory. The Slack Web API and Twitter APIs have been used to enable this feature.

### Lambdas

All executable lambdas are found in `src/lambdas`.

## Setup

Assuming Node.js (12.x) and NPM are installed, run `npm install`.

To deploy, run `sls deploy -v --aws-profile <AWS-PROFILE>`.

AWS credentials are needed to sign certain requests. Download the [AWS CLI](https://aws.amazon.com/cli/), request credentials from the CODEOWNER (or create your own), and setup your credentials as such

```bash
$ aws configure
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]:
Default output format [None]: json
```

For offline testing, run `sls offline start --stage local`. Before this command is run, start the official DynamoDB docker with `docker-compose up`. A script is provided for this, run `./scripts/run_offline.sh`.

Alternatively, to use Docker to host all of the infrastructure, refer to the [Contribution Guide](../CONTRIBUTING.md).

Then, use the client or query the API using Postman. There should be a single data point seeded.

Unit tests are now enabled for this component via Jest. To run, use `npm run test`

### Configuring SNS and tokens

Offline testing with SNS is now supported via the serverless-offline-ssm plugin. To use, create a `.env` file for local use with the following parameters

```env
sgvt-slack-bot-token=123
sgvt-slack-test-channel=123
sgvt-slack-notification-channel=123
sgvt-twitter-api-key=123
sgvt-twitter-api-secret-key=123
sgvt-twitter-access-token-key=123
sgvt-twitter-access-token-secret=123
```

- SLACK_BOT_TOKEN: The token provided by Slack
- SLACK_TEST_CHANNEL: A test channel ID you would like non-prod notifications to be sent to. Ensure the app has been added to the channel first. The channel ID can be found via the URL path the Slack web interface, prefixed `C`
- SLACK_NOTIFICATION_CHANNEL: A notification channel ID you would like prod notifications to be sent to.

AWS System Manager Parameter Store is used to store secret tokens relating to Slack and Twitter. If not using the plugin, and if there is a desire to hook a Slack App or Twitter account up, add the above parameters to AWS System Manager **manually**. A KNS key is already created as part of the serverless deploy.

Do note that Twitter requires one to petition for a developer account to access their APIs.
