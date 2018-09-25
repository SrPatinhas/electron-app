<template>
	<div class="app">
		<topbar :pluginsList="plugins"></topbar>	
		<div class="app-content" :class="[openMenu ? 'overlay-show' : '']">
			<Sidebar :open="openMenu"></Sidebar>
  			<component :is="pluginModule"></component>
		</div>
		<alert></alert>
	</div>
</template>

<script>
	import topbar from "./components/topbar";
	import Sidebar from "./components/sidebar";
	import alert from "./components/alert";

	export default {
		name: "core",
		components: {
			topbar,
			Sidebar,
			alert,
		},
		props: ["plugins"],
		data() {
			return {
				name: 'Electron app',
				openMenu: false,
				pluginModule: "localMedia"
			}
		},
		created() {
			let self = this;
			Event.$on('sidebarToggle', function () {
				self.toggle();
			});
			Event.$on('sidebarClose', function () {
				self.close();
			});

			Event.$on('changeModule', function (plugin) {
				console.log(plugin);
				self.close();
				self.pluginModule = plugin;
			});
		},
		methods: {
			toggle() {
				this.openMenu = !this.openMenu;
			},
			close() {
				this.openMenu = false;
			}
		},
	}
</script>
<style>
	@import url("../../public/font/fontawesome-5.3.1/css/all.min.css");
	@import url("../../semantic/dist/semantic.min.css");
	@import url("style/core.css");
</style>