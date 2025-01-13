const app = getApp();
const HOST = "https://coget.cn/runcar";
// const HOST = "http://nf6j74.natappfree.cc";
// const HOST = "http://127.0.0.1:8080";

const request = {
    fetch: (params, isHideTips) => {
        // 处理url
        let __url = params.url + '';
        if ((__url.indexOf('http')) != -1) {
            // http://coget.cn/
            const i1 = __url.indexOf('/', 8)
            let newUrl = __url.substring(i1)
            newUrl = newUrl.replace('runcar', '')
            
            params.url = `${HOST}${newUrl}`
        }
        //
        const data = params;
        isHideTips = false;
        if (params.url.indexOf('?') == -1) {
            data.url = `${params.url}?channel=3&client=1&language=ch&network=4&sdk=ios15.2.1&terminal=apple13&udid=1&version=v1.0.0`;
        } else {
            data.url = `${params.url}&channel=3&client=1&language=ch&network=4&sdk=ios15.2.1&terminal=apple13&udid=1&version=v1.0.0`;
        }
        
        const accessToken = app.globalData.accessToken;
        if (accessToken) {
            data.header = Object.assign({}, {
                Authorization: 'Bearer ' + accessToken ?? ''
            }, data.header ?? {});
        }
        return new Promise((resolve, reject) => {
            wx.request({
                ...data,
                success: (res) => {
                    const response = res.data ?? {};
                    if (response.code !== 0) {
                        if (!isHideTips) {
                            wx.showToast({
                                title: `${res.data.message}`,
                                icon: 'none'
                            })
                        }
                        reject(response);
                    } else {
                        resolve(response.data ?? {});
                    }
                },
                fail: (error) => {
                    if (!isHideTips) {
                        wx.showToast({
                            title: '系统出了点小小的差错,请稍后再试',
                            icon: 'none'
                        })
                    }
                    reject({message: '系统出了点小小的差错,请稍后再试'});
                }
            });
        })
    }
}
export default request;