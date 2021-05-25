import { Count } from "src/models/Count";
import { publishToTopic } from "src/notificationLayer/notificationAccess";
import { getHtmlContent, checkCountExists, getLatestCount, calculateHistoricals, createOrUpdateCount } from "./count";

const topicName = process.env.NEW_DATAPOINT_TOPIC_NAME;

export async function processLatestCount(sourceUrl?: string): Promise<[boolean, Count[]]> {
    const allCounts = await getHtmlContent(sourceUrl);
    const alreadyExists = await checkCountExists(allCounts[0]); // a sample will do, since all counts are synced together
    let results: Count[] = [];
    if (!alreadyExists) {
        for (const count of allCounts) {
            const lastCount = await getLatestCount(count.type);
            const countWithHistoricals = await calculateHistoricals(count, lastCount);
            results.push(countWithHistoricals);
        }
        return [true, results];
    }

    return [false, allCounts];
};

export async function writeLatestCount(countWithHistoricals: Count) {
    const result = await createOrUpdateCount(countWithHistoricals);
    await publishToTopic(topicName, 'NewDatapoint', result);
};