const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

async function resetAdminPassword() {
    await sequelize.authenticate();
    const newPassword = 'Admin123!@#';
    const hashed = await bcrypt.hash(newPassword, 12);
    await sequelize.query(
        "UPDATE users SET password = ? WHERE email = 'admin@chhaap.com'",
        { replacements: [hashed] }
    );
    console.log('Admin password reset successfully!');
    console.log('Email: admin@chhaap.com');
    console.log('Password: Admin123!@#');
    process.exit();
}
resetAdminPassword();
