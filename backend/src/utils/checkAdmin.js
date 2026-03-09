const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

async function checkAdmin() {
    await sequelize.authenticate();
    const [rows] = await sequelize.query("SELECT email, password FROM users WHERE role = 'admin'");
    if (rows.length === 0) {
        console.log('No admin user found!');
        process.exit(1);
    }
    const admin = rows[0];
    console.log('Admin email:', admin.email);
    const match = await bcrypt.compare('Admin123!@#', admin.password);
    console.log('Password match:', match);
    // process.exit();
}

// Only run if executed directly (not imported)
if (require.main === module) {
    checkAdmin();
}

module.exports = { checkAdmin };
