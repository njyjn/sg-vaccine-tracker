import { Count } from "src/models/Count";
import { postToSlack } from "src/notificationLayer/slackAccess";

export async function processNewDatapoint(event: Count): Promise<void> {
    try {
        const countCumulative = event.value.toString();
        const type = event.type.toString();
        const dateAsOf = event.dateAsOf.toString();
        const dateAsOfDate = new Date(dateAsOf).toLocaleDateString(undefined, { timeZone: 'Asia/Singapore' });
        
        const messageText = `I found new data on the MOH website today. As of ${dateAsOfDate}, ${countCumulative} Singaporeans have been \`${type}\``;
        await postToSlack(messageText);    
    } catch (e) {
        console.log('Failed to process data point', e);
    }
};
