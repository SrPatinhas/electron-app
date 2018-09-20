import Vue from 'vue';
import App from './App.vue';
import topbar from "./components/topbar.vue";

new Vue({
	el: '#app',
	render(h) {
		return h(App)
	}
})