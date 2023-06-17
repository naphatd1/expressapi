const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    JWT_SECRET: process.env.JET_SECRET,
    DB_DIALECT: process.env.DB_DIALECT,
    NODE_ENV_PROD: process.env.NODE_ENV_PROD,
    DB_USERNAME_PROD: process.env.DB_USERNAME_PROD,
    DB_PASSWORD_PROD: process.env.DB_PASSWORD_PROD,
    DB_DATABASE_PROD: process.env.DB_DATABASE_PROD,
    DB_HOST_PROD: process.env.DB_HOST_PROD,
    DB_PORT_PROD: process.env.DB_PORT_PROD,
    DB_DIALECT_PROD: process.env.DB_DIALECT_PROD,
    JWT_SECRET_PROD: process.env.JET_SECRET,
}