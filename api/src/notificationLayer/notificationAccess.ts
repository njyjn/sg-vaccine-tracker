import * as AWS from 'aws-sdk';

const snsClient = new AWS.SNS();

const awsRegion = process.env.AWS_REGION;
const awsAccountId = process.env.AWS_ACCOUNT_ID;

export async function publishToTopic(topicName: string, channelName: string, message: any): Promise<void> {
    try {
        const snsParams = {
            Message: JSON.stringify({
                ...message,
            }),
            TopicArn: `arn:aws:sns:${awsRegion}:${awsAccountId}:${topicName}`,
            MessageAttributes: {
                channel: {
                    DataType: 'String',
                    StringValue: channelName,
                }
            }
        }
        await snsClient.publish(snsParams).promise();    
    } catch (e) {
        console.log('Failed to publish to SNS topic', e);
    }
}
