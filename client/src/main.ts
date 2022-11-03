import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'normalize.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/assets/less/global.less'
import '@/assets/less/mixins.less'


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(createPinia()).use(router).mount('#app')
