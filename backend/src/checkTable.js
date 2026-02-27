require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { sequelize } = require('./models');

async function check() {
    try {
        const [results] = await sequelize.query('DESCRIBE settings');
        console.log(JSON.stringify(results, null, 2));
    } catch (error) {
        console.error('ERROR:', error.message);
    } finally {
        process.exit();
    }
}

check();
