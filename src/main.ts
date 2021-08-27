import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/antd.css'
import { Form, Button, Input } from 'ant-design-vue'

Vue.use(Form)
Vue.use(Button)
Vue.use(Input)

Vue.config.productionTip = false

new Vue({
	router,
	render: (h) => h(App),
}).$mount('#app')
