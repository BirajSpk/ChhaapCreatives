require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Setting, sequelize } = require('./models');


async function test() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        const settings = await Setting.findAll();
        console.log('Settings found:', settings.length);
        console.log('Data:', JSON.stringify(settings, null, 2));
    } catch (error) {
        console.error('DIAGNOSTIC FAILED:', error);
    } finally {
        process.exit();
    }
}

test();
