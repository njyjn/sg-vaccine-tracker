import { SNSEvent, SNSHandler } from "aws-lambda";
import { processNewDatapoint } from 'src/logic/notification';

export const handler: SNSHandler = async (event: SNSEvent) => {
    console.log('Processing SNS event ', JSON.stringify(event));
    for (const record of event.Records) {
        try {
            const eventStr = record.Sns.Message;
            console.log('Processing event', eventStr);
            const event = JSON.parse(eventStr);
            await processNewDatapoint(event);    
        } catch (e) {
            console.log('Failed to read from event queue... Skipping', e);
        }
    }
};