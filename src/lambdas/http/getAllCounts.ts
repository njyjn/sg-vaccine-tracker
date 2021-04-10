import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { getAllCounts} from 'src/logic/count';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event);

    let response;
    try {
        const countsResult = await getAllCounts();
        response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                counts: countsResult[0],
                nextKey: countsResult[1]
            })
        };
    } catch (e) {
        console.log('Failed to fetch all counts: ', e);
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