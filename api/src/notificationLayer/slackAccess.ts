import { WebClient } from '@slack/web-api';

let defaultTargetChannel = process.env.SLACK_NOTIFICATION_CHANNEL;
if (process.env.DEPLOY_STAGE !== 'prod') {
    defaultTargetChannel = process.env.SLACK_TEST_CHANNEL;
}

const token = process.env.SLACK_BOT_TOKEN;

export async function postToSlack(text: string, channel?: string): Promise<void> {
    try {
        const web = new WebClient(token);
        const targetChannel = channel || defaultTargetChannel
        await web.chat.postMessage({
            text: text,
            channel: targetChannel,
        });
        console.log('Sent message to channel', targetChannel);
    } catch (e) {
        console.log('Failed to send message to Slack channel', e);
    }
};