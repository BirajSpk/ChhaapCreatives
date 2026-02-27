const { Setting } = require('../models');

class SettingService {
    /* Get setting by key */
    static async get(key) {
        const setting = await Setting.findOne({ where: { key } });
        return setting ? setting.value : null;
    }

    /* Get all settings as a flat object */
    static async getAll() {
        const settings = await Setting.findAll();
        return settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
    }

    /* Update multiple settings at once */
    static async updateBulk(settingsObj) {
        const updates = Object.entries(settingsObj).map(([key, value]) => {
            return Setting.upsert({ key, value });
        });
        return Promise.all(updates);
    }
}

module.exports = SettingService;
