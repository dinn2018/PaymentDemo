import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
Vue.use(VueRouter)

const routes: RouteConfig[] = [
	{
		path: '/',
		name: 'approve',
		component: () => import(/* webpackChunkName: "approve" */ '../views/approve.vue'),
	},
	{
		path: '/calculations',
		name: 'calculations',
		component: () => import(/* webpackChunkName: "calculations" */ '../views/calculations.vue'),
	},
	{
		path: '/resources',
		name: 'resources',
		component: () => import(/* webpackChunkName: "resources" */ '../views/resources.vue'),
	},
	{
		path: '/buy',
		name: 'buy',
		component: () => import(/* webpackChunkName: "buy" */ '../views/buy.vue'),
	}
]

const router = new VueRouter({
	base: process.env.BASE_URL,
	routes,
})

export default router
