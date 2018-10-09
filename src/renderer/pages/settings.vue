<template>
	<div class="settings-content">
		<button @click="toggleSettings">Close Settings</button>
		<nav v-if="settings.plugins != null">
			<button v-for="app in settings.plugins">
				<img :src="app.icon" :alt="app.module">
				<span>{{ app.label }}</span>
			</button>
		</nav>

		<ul>
			<li v-for="path in settings.paths">
				{{ path }}
			</li>
		</ul>

		<div class="ui toggle checkbox">
			<input type="checkbox" name="public">
			<label>Auto Update {{ settings.autoUpdate }}</label>
		</div>
		<div class="ui toggle checkbox">
			<input type="checkbox" name="public">
			<label>Keep Downloads {{ settings.autoUpdate }}</label>
		</div>

		<div class="info">
			<p>Dreamovies App</p>
			<p>Ver 0.0.1 - <a href="https://dreamovies.tk/app">About</a></p>
			<p>App coded by: <a href="https://www.github.com/srpatinhas">SrPatinhas</a></p>
		</div>
	</div>
</template>

<script>

	export default {
		name: "settings",
		data() {
			return {
				settings: null,
			}
		},
		methods: {
			changePlugin(uuid, plugin){
                console.log(this.$db);
				for (let index in this.settings) {
					if(this.settings[index].uuid == uuid){
						if(!this.settings[index].active){
							this.settings[index].active = true;
							//require("../../../plugins/" + this.settings[index].module);
							Event.$emit("changeModule", plugin);
						}
					} else {
						this.settings[index].active = false;
					}
				}
			},
            toggleSettings(){
                Event.$emit('toggleSettings');
            },
		},
		created() {
		    this.settings = this.$root.settings;
		}
	}
</script>

<style>
	.settings-content {
		position: fixed;
		top: 30px;
		background: #464646;
		width: 100%;
		height: calc(100% - 30px);
		padding: 30px;
		color: white;
	}
</style>