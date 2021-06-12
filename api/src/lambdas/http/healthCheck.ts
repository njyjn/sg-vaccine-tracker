import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { corsOptions } from 'src/config';
import middy from '@middy/core';
import cors from '@middy/http-cors';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event);

    let response;
    try {
        response = {
            statusCode: 200,
        };
    } catch (e) {
        response = {
            statusCode: 500,
            body: JSON.stringify({
                error: e,
            })
        }
    } finally {
        return response;
    }
});

handler.use(cors(corsOptions));
