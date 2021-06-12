import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { recalculateAllHistoricals } from 'src/logic/count';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event);

    let response;
    try {
        const userId = event.requestContext.authorizer.principalId;
        await recalculateAllHistoricals(userId);

        response = {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                success: true
            })
        }
    } catch (e) {
        console.log('Failed to recalculate historicals: ', e);
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