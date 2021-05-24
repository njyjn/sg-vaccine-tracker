import Twitter from 'twitter-lite';

const consumer_key = process.env.TWITTER_CONSUMER_KEY;
const consumer_secret = process.env.TWITTER_SECRET_KEY;
const access_token_key = process.env.TWITTER_ACCESS_TOKEN_KEY;
const access_token_secret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

export async function postToTwitter(text: string): Promise<void> {
    try {
        const twitter = new Twitter({
            consumer_key: consumer_key,
            consumer_secret: consumer_secret,
            access_token_key: access_token_key,
            access_token_secret: access_token_secret,
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