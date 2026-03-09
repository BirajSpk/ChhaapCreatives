const { sequelize } = require('./src/config/database');
const { User } = require('./src/models');

async function reset() {
    try {
        console.log('Dropping users table...');
        await User.drop({ force: true }).catch(() => console.log('Table does not exist, continuing...'));
        console.log('Users table dropped successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

reset();
