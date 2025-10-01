const Layout = require('../models/Layout');

class LayoutService {
  async create(data) {
    return await Layout.create(data);
  }

  async findAll(query = {}, options = {}) {
    const { sort = { order: 1, name: 1 } } = options;
    return await Layout.find(query).sort(sort);
  }

  async findById(id) {
    return await Layout.findById(id);
  }

  async update(id, data) {
    return await Layout.findByIdAndUpdate(
      id,
      { ...data, updatedAt: Date.now() },
      { new: true }
    );
  }

  async softDelete(id) {
    return await Layout.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: Date.now(),
        updatedAt: Date.now()
      },
      { new: true }
    );
  }

  async findByType(type, options = {}) {
    const { language = 'vi', isActive = true } = options;
    return this.findAll(
      { type, language, isActive },
      { sort: { order: 1, name: 1 } }
    );
  }

  async findByPosition(position, options = {}) {
    const { language = 'vi', isActive = true } = options;
    return this.findAll(
      { position, language, isActive },
      { sort: { order: 1, name: 1 } }
    );
  }

  async updateOrder(items) {
    const operations = items.map(item => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } }
      }
    }));

    await Layout.bulkWrite(operations);
    return this.findAll();
  }

  async toggleVisibility(id) {
    const layout = await Layout.findById(id);
    if (!layout) return null;

    layout.display.isVisible = !layout.display.isVisible;
    layout.updatedAt = Date.now();
    await layout.save();
    return layout;
  }

  async setDisplayPeriod(id, startDate, endDate) {
    const layout = await Layout.findById(id);
    if (!layout) return null;

    layout.display.startDate = startDate;
    layout.display.endDate = endDate;
    layout.updatedAt = Date.now();
    await layout.save();
    return layout;
  }

  async getActiveBanners(group = null) {
    const now = new Date();
    const query = {
      type: 'banner',
      isActive: true,
      'display.isVisible': true,
      isDeleted: false
    };

    if (group) {
      query.bannerGroup = group;
    }

    query['display.startDate'] = { $lte: now };
    query['display.endDate'] = { $gte: now };

    return this.findAll(query, { sort: { groupOrder: 1, order: 1 } });
  }

  async updateGroupOrder(group, items) {
    const operations = items.map(item => ({
      updateOne: {
        filter: { _id: item.id, bannerGroup: group },
        update: { $set: { groupOrder: item.order } }
      }
    }));

    await Layout.bulkWrite(operations);
    return this.getActiveBanners(group);
  }

  async getBannersByPosition(position, options = {}) {
    const { language = 'vi', isActive = true, group = null } = options;
    const query = {
      type: 'banner',
      position,
      language,
      isActive,
      'display.isVisible': true,
      isDeleted: false
    };
    if (group) {
      query.bannerGroup = group;
    }
    return this.findAll(query, { sort: { groupOrder: 1, order: 1 } });
  }
}

module.exports = new LayoutService(); 
