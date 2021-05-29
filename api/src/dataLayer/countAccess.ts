import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Count } from 'src/models/Count';

const dbHost = process.env.DYNAMODB_HOST || 'localhost'

export class CountAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDbClient(),
        private readonly countsTable = process.env.COUNTS_TABLE,
    ) {}

    async getAllCounts(limit?: number, nextKey?: string): Promise<[Count[], DocumentClient.Key]> {
        console.log('Getting all counts');

        let exclusiveStartKey: DocumentClient.Key;

        if (nextKey) {
            exclusiveStartKey = { id: nextKey };
        }

        const result = await this.docClient.scan({
            TableName: this.countsTable,
            Limit: limit,
            ExclusiveStartKey: exclusiveStartKey,
        }).promise();
    
        const counts = result.Items as Count[];
        const lastEvaluatedKey = result.LastEvaluatedKey;
        return [counts, lastEvaluatedKey] ;
    };

    async createOrUpdateCount(count: Count): Promise<Count> {
        console.log('Creating or updating a count data point with data', count);

        await this.docClient.put({
            TableName: this.countsTable,
            Item: count,
        }).promise();

        return count;
    };

    async checkCountExists(count: Count): Promise<boolean> {
        console.log('Checking if count exists...', count);
        const record = await this.getCount(count.dateAsOf, count.type);
        if (record) {
            console.log(`Count for ${count.dateAsOf} already exists`)
            return true;
        }

        console.log(`Count for ${count.dateAsOf} does not exist`)
        return false;
    };
    
    async getCount(dateAsOf: string, type: string): Promise<Count> {
        const result = await this.docClient.get({
            TableName: this.countsTable,
            Key: {
                dateAsOf: dateAsOf,
                type: type,
            }
        }).promise();

        if (result.Item) {
            return result.Item as Count;
        }

        return null;
    };
}

function createDynamoDbClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance...');
        return new DocumentClient({
            region: 'localhost',
            endpoint: `http://${dbHost}:8000`,
        });
    }

    return new DocumentClient();
};