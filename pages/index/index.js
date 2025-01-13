import authorization from '../behaviors/authorization';
import request from '../../utils/request';
const app = getApp();
Page({
  behaviors: [authorization],
  data: {
    list: [],
    total: 0
  },
  onLoad () {
    this.checkAuth();
  },
  pageReadyCallback () {
    this.pageNo = 1;
    this.initList();
  },
  onShow () {
    if (app.globalData.accessToken) {
      this.pageReadyCallback();
    }
  },
  initList () {
    const _this = this;
    request.fetch({
      url: 'https://coget.cn/runcar/car/list',
      method: 'post',
      data: {
        pageSize: 10,
        pageNo: this.pageNo
      }
    }).then(res => {
      _this.setData({
        list: res?.list ?? [],
        total: res.total
      })
    })
  },
  async onPullDownRefresh () {
    this.pageNo = 1;
    await this.initList();
    wx.stopPullDownRefresh();
  },
  onReachBottom () {
    if (this.data.total === this.pageNo) return null;
    this.pageNo += 1;
    this.initList();
  },
  bindToDetail (e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/codeDetail/index?id=' + item.id,
    })
  }
})
