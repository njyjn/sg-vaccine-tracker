# SG Vaccine Tracker API

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

### Lambdas

All executable lambdas are found in `src/lambdas`.

## Setup

Assuming Node.js (12.x) and NPM are installed, run `npm install`.

To deploy, run `sls deploy -v --aws-profile <AWS-PROFILE>`.

For offline testing, run `sls offline start --stage local`. Before this command is run, start the official DynamoDB docker with `docker-compose up`. You could also install the serverless [dynamodb local plugin](https://www.npmjs.com/package/serverless-dynamodb-local) but it did not work for me as I use an M1 Mac that gave me issues. 

Then, use the client or query the API using Postman. There should be a single data point seeded.