const Setting = require('../models/Setting');

class SettingService {
  async getSettings() {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({
        siteName: 'My CMS',
        siteDescription: 'Content Management System',
        content: {
          defaultLanguage: 'vi',
          postsPerPage: 10,
          enableComments: true,
          enableRelatedPosts: true,
          relatedPostsCount: 3
        },
        display: {
          showAuthor: true,
          showDate: true,
          showCategories: true,
          showTags: true
        }
      });
    }
    return settings;
  }

  async updateSettings(data) {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(data);
      return settings;
    }

    return await Setting.findOneAndUpdate(
      {},
      { ...data, updatedAt: Date.now() },
      { new: true }
    );
  }

  async updatePartialSettings(section, data) {
    const settings = await Setting.findOne();
    if (!settings) {
      throw new Error('Settings not found');
    }

    settings[section] = {
      ...settings[section],
      ...data
    };

    await settings.save();
    return settings;
  }
}

module.exports = new SettingService(); 
