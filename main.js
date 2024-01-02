import App from './App'
// #ifndef VUE3
// #ifdef VUE3
import Vue, {createSSRApp} from 'vue'

import {$http} from '@escook/request-miniprogram'

uni.$http = $http

$http.baseUrl = 'https://api-hmugo-web.itheima.net'

$http.beforeRequest = function (options) {
    uni.showLoading({
        title: '数据加载中...',
    })
}

$http.afterRequest = function () {
    uni.hideLoading()
}

uni.$showMsg = function (title = "数据请求失败", duration = 1500) {
    uni.showToast({
        title,
        duration,
        icon: 'none'
    })
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif
export function createApp() {
    const app = createSSRApp(App)
    return {
        app
    }
}

// #endif