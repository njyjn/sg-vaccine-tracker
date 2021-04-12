import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { getHtmlContent, createOrUpdateCount, checkCountExists } from 'src/logic/count';
import { Count } from "src/models/Count";
import { publishToTopic } from 'src/notificationLayer/notificationAccess'

const topicName = process.env.NEW_DATAPOINT_TOPIC_NAME;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event);

    let response;
    let sourceUrl: string;
    try {
        if (event.queryStringParameters) {
            sourceUrl = event.queryStringParameters.sourceUrl
        }
        const count = await getHtmlContent(sourceUrl);
        const alreadyExists = await checkCountExists(count);
        let result: Count;
        if (!alreadyExists) {
            result = await createOrUpdateCount(count);
            await publishToTopic(topicName, 'NewDatapoint', result);
            response = {
                statusCode: 201,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    count: result,
                })
            };
        } else {
            response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    count: count,
                })
            };
        }
    } catch (e) {
        console.log('Failed to process latest count: ', e);
        response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: e.message,
            })
        }
    } finally {
        return response;
    }
};