import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { createOrUpdateCount } from 'src/logic/count';
import { Count } from "src/models/Count";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event);

    let response;
    try {
        const userId = event.requestContext.authorizer.principalId;
        const newCounts: Count[] = JSON.parse(event.body);
        for (const newCount of newCounts) {
            newCount.lastModified = new Date().toISOString();
            newCount.lastModifiedBy = userId;
            await createOrUpdateCount(newCount)
        }
        response = {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(newCounts)
        }
    } catch (e) {
        console.log('Failed to upsert counts: ', e);
        response = {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: e,
            })
        }
    } finally {
        return response;
    }
};