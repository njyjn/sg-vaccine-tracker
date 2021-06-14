import { Count } from "src/models/Count";
import { publishToTopic } from "src/notificationLayer/notificationAccess";
import { getHtmlContent, checkCountExists, getLatestCount, calculateHistoricals, createOrUpdateCount } from "./count";

const topicName = process.env.NEW_DATAPOINT_TOPIC_NAME;

export async function processLatestCount(sourceUrl?: string): Promise<[boolean, Count[]]> {
    const allCounts = await getHtmlContent(sourceUrl);
    let results: Count[] = [];
    for (const count of allCounts) {
        const alreadyExists = await checkCountExists(count);
        if (!alreadyExists) {
            const lastCount = await getLatestCount(count.type);
            const countWithHistoricals = await calculateHistoricals(count, lastCount);
            results.push(countWithHistoricals);
        }
    };
    if (results.length > 0) {
        return [true, results];
    }

    return [false, allCounts];
};

export async function writeLatestCount(countWithHistoricals: Count) {
    const result = await createOrUpdateCount(countWithHistoricals);
    await publishToTopic(topicName, 'NewDatapoint', result);
};