const Layout = require('../../models/Layout');

class FooterService {
  async getFooter(language = 'vi') {
    let footers = await this.findByType('footer', { language, isActive: true });
    if (!footers || footers.length === 0) {
      const defaultFooter = this.getDefaultFooter(language);
      const footer = await this.create(defaultFooter);
      return footer.content;
    }
    return footers[0].content;
  }

  async updateFooter(language = 'vi', data) {
    let footers = await this.findByType('footer', { language, isActive: true });
    if (footers && footers.length > 0) {
      const footer = await Layout.findById(footers[0]._id);
      // Cập nhật từng trường nếu có
      if (data.description !== undefined) footer.content.description = data.description;
      if (data.socials !== undefined) footer.content.socials = data.socials;
      if (data.quickLinks !== undefined) footer.content.quickLinks = data.quickLinks;
      if (data.newsletter !== undefined) footer.content.newsletter = data.newsletter;
      if (data.copyright !== undefined) footer.content.copyright = data.copyright;
      footer.updatedAt = Date.now();
      footer.markModified('content');
      await footer.save();
      return footer.content;
    } else {
      // Tạo mới nếu chưa có
      const newFooter = this.getDefaultFooter(language);
      Object.assign(newFooter.content, data);
      const footer = await this.create(newFooter);
      return footer.content;
    }
  }

  async deleteFooter(language = 'vi') {
    let footers = await this.findByType('footer', { language, isActive: true });
    if (footers && footers.length > 0) {
      await Layout.deleteOne({ _id: footers[0]._id });
      return true;
    }
    return false;
  }

  getDefaultFooter(language = 'vi') {
    return {
      type: 'footer',
      name: 'Main Footer',
      position: 'main',
      content: {
        description: 'Khám phá về đẹp và sự sôi động ...',
        socials: [
          { type: 'facebook', url: 'https://facebook.com/' },
          { type: 'instagram', url: 'https://instagram.com/' },
          { type: 'youtube', url: 'https://youtube.com/' },
          { type: 'twitter', url: 'https://twitter.com/' }
        ],
        quickLinks: [
          { label: 'Trang chủ', url: '/' },
          { label: 'Khám phá', url: '/kham-pha' },
          { label: 'Sự kiện', url: '/su-kien' },
          { label: 'Thông tin', url: '/thong-tin' },
          { label: 'Liên hệ', url: '/lien-he' }
        ],
        newsletter: {
          title: 'Đăng ký nhận tin',
          description: 'Nhận những câu chuyện du lịch mới ...',
          placeholder: 'Email của bạn',
          buttonLabel: 'Đăng ký'
        },
        copyright: '© Hoang Duong. All rights reserved.'
      },
      language,
      isActive: true
    };
  }

  async findByType(type, options = {}) {
    const { language = 'vi', isActive = true } = options;
    return Layout.find({ type, language, isActive }).sort({ order: 1, name: 1 });
  }
  async create(data) {
    return await Layout.create(data);
  }
}

module.exports = new FooterService(); 
