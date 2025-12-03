import './assets/main.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { VFileUpload } from 'vuetify/labs/VFileUpload'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components: {
    ...components,
    VFileUpload,
  },
  directives,
  theme: {
    defaultTheme: 'dark',
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
