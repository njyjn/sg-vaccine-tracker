const apiId = process.env.REACT_APP_API_ID;
const apiStage = process.env.REACT_APP_API_STAGE;
export const apiToken = process.env.REACT_APP_API_TOKEN;
const domain = process.env.REACT_APP_AUTH0_DOMAIN || '';
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || '';
const callbackUrl =process.env.REACT_APP_AUTH0_CALLBACK_URL || '';

export const apiEndpoint = `${apiId}/${apiStage}`;

export const authConfig = {
    domain: domain,
    clientId: clientId,
    callbackUrl: callbackUrl
}