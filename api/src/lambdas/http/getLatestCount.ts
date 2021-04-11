import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { getLatestCount } from 'src/logic/count';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event);

    let response;
    try {
        const count = await getLatestCount();
        response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                ...count
            })
        };
    } catch (e) {
        console.log('Failed to fetch latest count: ', e);
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