const apiId = process.env.API_ID;
const apiStage = process.env.API_STAGE;
export const apiToken = process.env.API_TOKEN;

export const apiEndpoint = `${apiId}/${apiStage}`;
