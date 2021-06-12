const commonOrigins = [
    '*'
]

export const corsOptions = {
    credentials: true,
    origins: commonOrigins
};

export const slsCorsOrigins = commonOrigins;

export const jwksUrl = 'https://example.us.auth0.com/.well-known/jwks.json'