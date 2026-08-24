require('dotenv').config();

const config  = {
    port: parseInt(process.env.PORT, 10) || 3000,
    db: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        database: process.env.DB_DATABASE,
    },
}

module.exports = config;

if (!config.db.password || !config.db.user) {
    console.error('❌ DB_USER or DB_PASSWORD is not set in .env');
    process.exit(1);
}