import '@/assets/style.css'
import { t } from '@yeying-community/yeying-i18n'
import '@yeying-community/yeying-wallet/dist/yeying-wallet.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import { routes } from '@/router'
import { createRouter, createWebHistory, Router } from 'vue-router'
import { createWallet, sdkRoutes } from '@yeying-community/yeying-wallet'
import { initializeProviders } from '@/plugins/account'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { notifyError, notifySuccess } from './utils/message'

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus, {
    locale: zhCn
})

app.config.globalProperties.$t = t

// 合并路由
const router: Router = createRouter({
    history: createWebHistory(),
    routes: [...routes, ...sdkRoutes]
})

app.use(router)

initializeProviders()
  .then(() => {
    app.mount('#app')
  })
  .catch((error) => {
    console.error('Failed to initialize providers:', error)
    // 可以显示错误页面或提示
    app.mount('#app') // 即使失败也挂载，避免白屏
  })