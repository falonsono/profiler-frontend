import Vue from 'vue';
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import MainPage from '../components/MainPage';
import UserProfile from '../components/UserProfile';
import NotFound from '../components/NotFound';

const routes = [
	{
		path: '/',
		name: 'main',
		component: MainPage,
		meta: {
			title: 'MainPage',
			public: true,
		},
	},
	{
		path: '/profile/:username',
		name: 'profile',
		component: UserProfile,
		props: true,
		meta: {
			title: 'UserProfile',
			public: true,
		},
	},
	{ path: "*", component: NotFound }
];

const router = new VueRouter({
	routes
});

export default router;