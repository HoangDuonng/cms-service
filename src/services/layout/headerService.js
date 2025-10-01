const Layout = require('../../models/Layout');

class HeaderService {
  async getHeader(language = 'vi') {
    let headers = await this.findByType('header', { language, isActive: true });
    if (!headers || headers.length === 0) {
      const defaultHeader = this.getDefaultHeader(language);
      const header = await this.create(defaultHeader);
      return header.content;
    }
    return headers[0].content;
  }

  async updateHeader(language = 'vi', data) {
    const { logo, navigation, languages } = data;
    let headers = await this.findByType('header', { language, isActive: true });
    if (headers && headers.length > 0) {
      const header = await Layout.findById(headers[0]._id);
      if (logo !== undefined) header.content.logo = logo;
      if (navigation !== undefined) header.content.navigation = navigation;
      if (languages !== undefined) header.content.languages = languages;
      header.updatedAt = Date.now();
      header.markModified('content');
      await header.save();
      return header.content;
    } else {
      // Tạo mới nếu chưa có
      const newHeader = {
        type: 'header',
        name: 'Main Header',
        position: 'main',
        content: {
          logo: logo || this.getDefaultHeader(language).content.logo,
          navigation: navigation || this.getDefaultHeader(language).content.navigation,
          languages: languages || this.getDefaultHeader(language).content.languages
        },
        language,
        isActive: true
      };
      const header = await this.create(newHeader);
      return header.content;
    }
  }

  async updateHeaderLogo(language = 'vi', logo) {
    const headers = await this.findByType('header', { language, isActive: true });
    if (!headers || headers.length === 0) throw new Error('Header not found');
    const header = await Layout.findById(headers[0]._id);
    header.content.logo = logo;
    header.updatedAt = Date.now();
    header.markModified('content');
    await header.save();
    return header.content;
  }

  async updateHeaderNavigation(language = 'vi', navigation) {
    const headers = await this.findByType('header', { language, isActive: true });
    if (!headers || headers.length === 0) throw new Error('Header not found');
    const header = await Layout.findById(headers[0]._id);
    header.content.navigation = navigation;
    header.updatedAt = Date.now();
    header.markModified('content');
    await header.save();
    return header.content;
  }

  async addNavigationItem(language = 'vi', title, href) {
    const headers = await this.findByType('header', { language, isActive: true });
    if (!headers || headers.length === 0) throw new Error('Header not found');
    const header = await Layout.findById(headers[0]._id);
    header.content.navigation = [
      ...(header.content.navigation || []),
      { title, href, isActive: false }
    ];
    header.updatedAt = Date.now();
    header.markModified('content');
    await header.save();
    return header.content;
  }

  async removeNavigationItem(language = 'vi', href) {
    const headers = await this.findByType('header', { language, isActive: true });
    if (!headers || headers.length === 0) throw new Error('Header not found');
    const header = await Layout.findById(headers[0]._id);
    header.content.navigation = (header.content.navigation || []).filter(item => item.href !== href);
    header.updatedAt = Date.now();
    header.markModified('content');
    await header.save();
    return header.content;
  }

  async updateHeaderLanguages(language = 'vi', languages) {
    const headers = await this.findByType('header', { language, isActive: true });
    if (!headers || headers.length === 0) throw new Error('Header not found');
    const header = await Layout.findById(headers[0]._id);
    header.content.languages = languages;
    header.updatedAt = Date.now();
    header.markModified('content');
    await header.save();
    return header.content;
  }

  getDefaultHeader(language = 'vi') {
    return {
      type: 'header',
      name: 'Main Header',
      position: 'main',
      content: {
        logo: {
          context: "images",
          entityId: "layout-client",
          filename: "5775f570-26d1-4e5c-85e2-acc54f0f0c90.svg"
        },
        navigation: [
          {
            title: "Khám phá",
            href: "/kham-pha",
            isActive: true
          },
          {
            title: "Khách sạn", 
            href: "/khach-san",
            isActive: true
          },
          {
            title: "Lễ hội và sự kiện",
            href: "/le-hoi-va-su-kien", 
            isActive: true
          },
          {
            title: "Tin tức",
            href: "/tin-tuc",
            isActive: true
          },
          {
            title: "Cẩm nang du lịch",
            href: "/cam-nang-du-lich",
            isActive: true
          }
        ],
        languages: [
          { value: "vi", label: "Tiếng Việt" },
          { value: "en", label: "English" }
        ]
      },
      language,
      isActive: true
    };
  }

  // Các hàm phụ trợ dùng chung
  async findByType(type, options = {}) {
    const { language = 'vi', isActive = true } = options;
    return Layout.find({ type, language, isActive }).sort({ order: 1, name: 1 });
  }
  async create(data) {
    return await Layout.create(data);
  }
}

module.exports = new HeaderService(); 