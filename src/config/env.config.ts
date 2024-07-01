export const EnvConfiguration = () => ({

    NODE_ENV: process.env.NODE_ENV || 'dev',
    MONGODB: process.env.MONGODB,
    PORT: process.env.PORT || 3002,
    DEFAULT_LIMIT: +process.env.DEFAULT_LIMIT || 7

});