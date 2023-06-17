const config = require('./index')

module.exports = {

    "production": {
        "username": config.DB_USERNAME,
        "password": config.DB_PASSWORD,
        "database": config.DB_DATABASE,
        "host": config.DB_HOST,
        "dialect": config.DB_DIALECT,
        "port": config.DB_PORT,
        dialectOptions: {
            ssl: {
                rejectUnauthorized: true,
            }
        }
    },
    // "test": {
    //     "username": "root",
    //     "password": null,
    //     "database": "database_test",
    //     "host": "127.0.0.1",
    //     "dialect": "mysql"
    // },
    // "production": {
    //     "username": "root",
    //     "password": null,
    //     "database": "database_production",
    //     "host": "127.0.0.1",
    //     "dialect": "mysql"
    // }


}