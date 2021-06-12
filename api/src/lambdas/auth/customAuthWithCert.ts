import { APIGatewayAuthorizerHandler, APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from "aws-lambda";
import { verifyToken } from 'src/auth/utils';

var signingKeys = [];

// Uses RS256 where certs are retrieved from the JWKS URL
export const handler: APIGatewayAuthorizerHandler = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
    let response;

    try {
        const decodedToken = await verifyToken(event.authorizationToken, signingKeys);
        console.log('User was authorized', decodedToken);
        response = {
            principalId: decodedToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*',
                    }
                ]
            }    
        }
    } catch (err) {
        console.log('User was not authorized', err.message);
        response = {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*',
                    }
                ]
            }
        }
    } finally {
        return response;
    };
};
