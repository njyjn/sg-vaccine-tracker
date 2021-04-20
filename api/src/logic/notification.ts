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

const mahjongBar: Array<String> = [
    '🀫','🀑','🀒','🀓','🀕','🀕','🀕','🀗','🀗','🀗','🀅','🀅','🀅','🀑','🀑'
];

const defaultBar: Array<String> = [
    '_','-','-','-','-','-','-','-','-','-','-'
]

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
        createProgessBar: createProgessBar,
        mahjongBar: mahjongBar,
    }
}
