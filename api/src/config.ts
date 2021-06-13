const commonOrigins = process.env.COMMON_ORIGINS.split(',');

export const corsOptions = {
    credentials: true,
    origins: commonOrigins
};

export const slsCorsOrigins = commonOrigins;

export const jwksUrl = process.env.JWKS_URL