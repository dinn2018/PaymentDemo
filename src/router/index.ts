import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import BuyTokenValuatedResourceByOtherExactToken from '../views/BuyTokenValuatedResourceByOtherExactToken.vue'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
	{
		path: '/',
		name: 'BuyTokenValuatedResourceByOtherExactToken',
		component: BuyTokenValuatedResourceByOtherExactToken,
	},
	{
		path: '/calculations',
		name: 'Calculations',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ '../views/Calculations.vue'),
	},
	{
		path: '/BuyTokenValuatedSwapResourceByOtherExactToken',
		name: 'BuyTokenValuatedSwapResourceByOtherExactToken',
		component: () => import(/* webpackChunkName: "about" */ '../views/BuyTokenValuatedSwapResourceByOtherExactToken.vue'),
	},
]

const router = new VueRouter({
	base: process.env.BASE_URL,
	routes,
})

export default router
