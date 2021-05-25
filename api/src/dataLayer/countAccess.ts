import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Count, CountKey } from 'src/models/Count';

export class CountAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDbClient(),
        private readonly countsTable = process.env.COUNTS_TABLE,
    ) {}

    async getAllCounts(type?: string, limit?: number, nextKey?: string): Promise<[Count[], DocumentClient.Key]> {
        console.log(`Getting all counts for ${type}`);

        let exclusiveStartKey: DocumentClient.Key;

        if (nextKey) {
            let [ dateAsOf, type ] = nextKey.split(',');
            exclusiveStartKey = {
                dateAsOf: dateAsOf,
                type: type
            } as CountKey;
        }

        let result;
        if (type) {
            result = await this.docClient.query({
                TableName: this.countsTable,
                Limit: limit,
                ExclusiveStartKey: exclusiveStartKey,
                ScanIndexForward: true,
                KeyConditionExpression: '#type = :type',
                ExpressionAttributeNames: {
                    '#type': 'type'
                },
                ExpressionAttributeValues: {
                    ':type': type
                },
            }).promise();
        } else {
            result = await this.docClient.scan({
                TableName: this.countsTable,
                Limit: limit,
                ExclusiveStartKey: exclusiveStartKey,
            }).promise();
        }
    
        const counts = result.Items as Count[];
        const lastEvaluatedKey = result.LastEvaluatedKey;
        return [counts, lastEvaluatedKey] ;
    };

    async getLatestCount(type: string): Promise<Count> {
        console.log(`Getting counts for ${type}`);

        const result = await this.docClient.query({
            TableName: this.countsTable,
            Limit: 1,
            ScanIndexForward: true,
            KeyConditionExpression: '#type = :type',
            ExpressionAttributeNames: {
                '#type': 'type'
            },
            ExpressionAttributeValues: {
                ':type': type
            },
        }).promise();

        return result.Items[0] as Count;
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
            endpoint: 'http://localhost:8000',
        });
    }

    return new DocumentClient();
};