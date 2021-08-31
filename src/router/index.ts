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
		path: '/calculation',
		name: 'calculation',
		component: () => import(/* webpackChunkName: "calculation" */ '../views/calculation.vue'),
	},
	{
		path: '/statistics',
		name: 'statistics',
		component: () => import(/* webpackChunkName: "resources" */ '../views/statistics.vue'),
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
