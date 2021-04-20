import Twitter from 'twitter-lite';

const consumer_key = process.env.TWITTER_CONSUMER_KEY;
const consumer_secret = process.env.TWITTER_SECRET_KEY;
const bearer_token = process.env.TWITTER_BEARER_TOKEN;

export async function postToTwitter(text: string): Promise<void> {
    try {
        const twitter = new Twitter({
            consumer_key: consumer_key,
            consumer_secret: consumer_secret,
            bearer_token: bearer_token
        });
        const tweet = await twitter.post(
            'statuses/update',
            {
                status: text
            }
        );
        console.log(`Tweeted ${text} as ${tweet.id_str}`);
    } catch (e) {
        console.log('Failed to send tweet', e);
    }
};