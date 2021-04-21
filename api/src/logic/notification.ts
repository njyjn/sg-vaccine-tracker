import { Count } from "src/models/Count";
import { postToSlack } from "src/notificationLayer/slackAccess";
import { postToTwitter } from "src/notificationLayer/twitterAccess";
import { calculatePercentage } from "./count";

const stage = process.env.DEPLOY_STAGE;

export async function processNewDatapoint(event: Count): Promise<void> {
    try {
        const countCumulativeInt: number = event.value;
        const countCumulative: string = event.value.toString();
        const type = event.type.toString();
        const dateAsOf = event.dateAsOf.toString();
        const dateAsOfDate = new Date(dateAsOf).toLocaleDateString(undefined, { timeZone: 'Asia/Singapore' });

        const messageText = `I found new data on the MOH website today. As of ${dateAsOfDate}, ${countCumulative} Singaporeans have been \`${type}\``;
        await postToSlack(messageText);

        const tweetText = buildTweet(countCumulativeInt, mahjongBar);

        if (stage === 'prod') {
            await postToTwitter(tweetText);
        } else {
            console.log(`Skipping sending '${tweetText}' to Twitter as not in Production`);
        }
    } catch (e) {
        console.log('Failed to process data point', e);
    }
};

const mahjongBar: Array<String> = [
    '🀫','🀑','🀒','🀓','🀕','🀕','🀕','🀗','🀗','🀗','🀅','🀅','🀅','🀑','🀑'
];

const defaultBar: Array<String> = [
    '_','-','-','-','-','-','-','-','-','-','-'
];

function buildTweet(count: number, style?: Array<String>, total?: number): string {
    const percent = calculatePercentage(count, total);
    const progressBar = createProgessBar(percent, style);

    return `${percent}%\n${progressBar}`;
};

function createProgessBar(percent: number, style?: Array<String>): string {
    const barStyle = style || defaultBar;
    const barLength = barStyle.length - 1;
    const nullSym = barStyle[0];

    const ratio = percent / 100.0;
    const progress = Math.round(ratio * barLength);

    var progressBar = barStyle.slice(1, progress + 1);
    for (var i = progress; i < barLength; i++) {
        progressBar.push(nullSym);
    }
    const progressString = progressBar.join('');
    console.log(`A bar for ${percent}, was generated: ${progressString}`);

    return progressString
}

export let testables;
if (process.env.NODE_ENV === 'test') {
    testables = {
        buildTweet: buildTweet,
        createProgessBar: createProgessBar,
        mahjongBar: mahjongBar,
    }
}
