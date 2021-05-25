import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getLatestCount } from 'src/logic/count';
import { corsOptions } from 'src/config';
import middy from '@middy/core';
import cors from '@middy/http-cors';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event);

    let response;
    try {
        const count = await getLatestCount('fullyVaccinated');
        const countPartial = await getLatestCount('partiallyVaccinated');
        const countTotal = await getLatestCount('totalVaccinated');
        response = {
            statusCode: 200,
            body: JSON.stringify({
                count,
                countPartial,
                countTotal,
            })
        };
    } catch (e) {
        console.log('Failed to fetch latest count: ', e);
        response = {
            statusCode: 400,
            body: JSON.stringify({
                error: e,
            })
        }
    } finally {
        return response;
    }
});

handler.use(cors(corsOptions));
