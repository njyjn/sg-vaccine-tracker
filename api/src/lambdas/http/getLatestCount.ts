import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { getLatestCount } from 'src/logic/count';

const stageOrigin = process.env.STAGE_ORIGIN;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event);

    let response;
    try {
        const count = await getLatestCount();
        response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': stageOrigin,
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
                'Access-Control-Allow-Origin': stageOrigin,
            },
            body: JSON.stringify({
                error: e,
            })
        }
    } finally {
        return response;
    }
};