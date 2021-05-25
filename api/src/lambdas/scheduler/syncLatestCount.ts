import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { processLatestCount, writeLatestCount } from "src/logic/sync";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event);

    let response;
    let sourceUrl: string;
    try {
        if (event.queryStringParameters) {
            sourceUrl = event.queryStringParameters.sourceUrl
        }
        const syncResponse = await processLatestCount(sourceUrl);
        if (syncResponse[0]) {
            for (const countWithHistoricals of syncResponse[1]) {
                try {
                    await writeLatestCount(countWithHistoricals);
                } catch (e) {
                    console.log(`Failed to write latest count ${countWithHistoricals}`, e);
                }
            }
        }
        response = {
            statusCode: syncResponse[0] ? 201 : 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                counts: syncResponse[1]
            })
        };
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