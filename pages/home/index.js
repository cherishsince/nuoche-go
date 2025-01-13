import authorization from '../behaviors/authorization';
import request from './../../utils/request'

Page({
  behaviors: [authorization],
  data: {
    // car list
    qrCode: '',
    isShowBindQrCode: false,
    list: [],
  },
  onLoad: function (options) {
    this.options = options;
    // 认证
    this.checkAuth();
  },
  pageReadyCallback() {
    // this.options = {
    //   p: 'https%3A%2F%2Fcoget.cn%2FrunCarQr%2FcodeTest%2F%3Fcode%3Da36b346459914129ab59544b95904bf4',
    // };
    const options = this.options;
    console.log('options', options); 
    if (options.q) {
      this.data.qrCode = options.q;
      console.log('options', options); 
      this.handleScan({text: options.q});
    }
    // 只处理一次
    this.options = {};
  },
  redirectToHome () {
    wx.navigateTo({
      url: '/pages/receiveCode/index',
    })
  },
  toInstructions () {
    wx.navigateTo({
      url: '/pages/instructions/instructions',
    })
  },
  qrCodeScan () {
    const _this = this;
    wx.scanCode({
      success(res) {
        console.log(res);
        const { scanType } = res;
        // 这里分为 "WX_CODE" "QR_CODE"
        // QR_CODE 在 result
        // WX_CODE 在 path 路径中
        let qrCode = res.result;
        if (scanType == 'WX_CODE') {
          qrCode = res.path;
        }
        _this.handleScan({text: qrCode});
        _this.setData({
          qrCode,
        });
      }, 
      complete: function() {
        wx.hideLoading({});
      },
    })
  },
  handleScan(data) {
    wx.showLoading({
      title: '绑定中...',
    })
    const _this = this;
    request.fetch({
      url: 'https://coget.cn/runcar/scan/wxAppletScan',
      method: 'post',
      data: data
    }, false).then(result => {
      // type 1、车主首页跳转 2、二维码绑定 3、快速创建并绑定
      if (result.type == 3) {
        const codeParams = result.value.split('=');
        wx.redirectTo({
          url: `/pages/receiveCode/index?q=${codeParams[1]}`,
        })
      } else if (result.type == 1) {
        const codeParams = result.value.split('=');
        wx.redirectTo({
          url: `/pages/outside/index?q=${codeParams[1]}`,
        })
      } else if (result.type == 2) {
        // 先调用 carList
        _this.initList();
        // 显示 qrCode
        _this.showBindQrCode();
      }
    }).catch (error => {
      wx.showToast({
        title: `${error.message}`,
        icon: 'none'
      })
    }).finally(_ => {
      wx.hideLoading({});
    })
  },
  onShareAppMessage () {
    return {
      title: '快来领取你的挪车码哦'
    }
  },
  onShareTimeline () {
    return {
      title: '快来领取你的挪车码哦'
    }
  },
  // 扫一扫 绑定 二维码功能
  showBindQrCode () {
    this.setData({
      isShowBindQrCode: true
    })
  },
  hideBinQrCode () {
    this.setData({
        isShowBindQrCode: false
    })
  },
  initList () {
    const _this = this;
    request.fetch({
      url: 'https://coget.cn/runcar/car/list',
      method: 'post',
      data: {
        pageSize: 100,
        pageNo: 1
      }
    }).then(res => {
      _this.setData({
        list: res?.list ?? [],
        total: res.total
      })
    })
  },
  bindCar(e) {
    // 获取 dataset
    const dataset = e.currentTarget.dataset;
    // 获取 carId
    const _this = this;
    request.fetch({
      url: 'https://coget.cn/runcar/car/reBindQrCode',
      method: 'post',
      data: {
        id: dataset.id,
        qrCode: _this.data.qrCode,
      }
    }, false).then(res => {
      wx.showToast({
        title: '绑定成功!',
        icon: 'none'
      });
      // 关闭 qr modal
      _this.hideBinQrCode();
    }).fail(error => {
      wx.showToast({
        title: `绑定失败! ${error.message}`,
        icon: 'none'
      });
    })
  },
})