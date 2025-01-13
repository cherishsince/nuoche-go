App({
  onLaunch() {
    const _this = this;
    wx.getSystemInfo({
      success: (result) => {
        _this.globalData.statusBarHeight = result.statusBarHeight + 10;
      },
    })
  },
  globalData: {
    statusBarHeight: 0,
    accessToken: ''
  }
})
