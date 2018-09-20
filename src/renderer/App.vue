<template>
	<div class="app">
		<topbar></topbar>
		<div class="content">
  			<div>{{name}}</div>
		</div>
	</div>
</template>

<script>
	import topbar from "./components/topbar.vue"
	export default {
		name: "core",
		components: {
			topbar,
		},
		data() {
			return {
				name: 'Electron app'
			}
		}
	}
</script>
<style>
	html,
	body{
		padding: 0;
		margin: 0;
		display: block;
		position: relative;
		width: 100%;
		height: 100%;
		-webkit-app-region: no-drag;
	}
	.app {
		width: 100%;
		height: 100%;
		position: relative;
		display: block;
		background: #eee;
		/*border-radius: 5px;
		border: 1px solid #dadada;
		box-sizing: border-box;
		overflow: hidden;*/
	}
	.content {
		width: 100%;
		height: calc(100% - 30px);
		background: #599df0;
	}
</style>