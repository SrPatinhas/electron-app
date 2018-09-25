<template>
	<div class="app-bar title-bar">
		<div v-if="os_windows" class="cell window-controls">
			<div @click="close" class="btn window red"></div>
			<div @click="minimize" class="btn window yellow"></div>
			<div @click="maximize" class="btn window green"></div>
		</div>
		<div class="cell navigation">
			<svg @click="toggleSidebar">
				<path class="burger"></path>  
			</svg>
		</div>
		<div class="cell tabs">
			<div v-for="app in pluginsList" :class="['tab', app.active ? 'active' : 'inactive']" @click="changePlugin(app.uuid, app.module)">
				<img :src="app.icon" :alt="app.module">
			</div>
			<div class="btn new-tab">
				<svg>
					<path class="plus"></path>
				</svg>
			</div>
		</div>

		<div v-if="!os_windows" class="cell os_windows">
			<div @click="minimize" class="btn minimize"></div>
			<div @click="maximize" class="btn maximize"></div>
			<div @click="close" class="btn close"></div>
		</div>
	</div>
</template>

<script>
	const remote = require('electron').remote;
	const os = require('os');
	//console.log(os.type()); // "Windows_NT"
	//console.log(os.release()); // "10.0.14393"
	//console.log(os.platform()); // "win32"

	export default {
		name: "topbar",
		props: ["pluginsList"],
		data() {
			return {
				win_app: remote.getCurrentWindow(),
				os_windows: (os.platform() != "win32"),
				color: "#000000",
				opacity: 0.5,
				/*pluginsList: window.pluginList,
				[
					{
						uuid: 1,
						active: true,
						module: "localMedia",
						icon: "https://cdn.dribbble.com/assets/dribbble-ball-192-ec064e49e6f63d9a5fa911518781bee0c90688d052a038f8876ef0824f65eaf2.png",
					},
					{
						uuid: 2,
						active: false,
						module: "torrentPlayer",
						icon: "https://cdn.dribbble.com/assets/dribbble-ball-192-ec064e49e6f63d9a5fa911518781bee0c90688d052a038f8876ef0824f65eaf2.png",
					},
					{
						uuid: 3,
						active: false,
						module: "Dreamovies",
						icon: "https://cdn.dribbble.com/assets/dribbble-ball-192-ec064e49e6f63d9a5fa911518781bee0c90688d052a038f8876ef0824f65eaf2.png",
					},
					{
						uuid: 4,
						active: false,
						module: "messageChat",
						icon: "https://cdn.dribbble.com/assets/dribbble-ball-192-ec064e49e6f63d9a5fa911518781bee0c90688d052a038f8876ef0824f65eaf2.png",
					}
				],*/
			}
		},
		methods: {
			close(){
				this.win_app.close();
			},
			minimize(){
				this.win_app.minimize();
			},
			maximize(){
				if(this.win_app.isMaximized()){
					this.win_app.unmaximize();
				} else {
					this.win_app.maximize();
				}
			},
			toggleSidebar(){
				Event.$emit('sidebarToggle');
			},
			changePlugin(uuid, plugin){
				for (let index in this.pluginsList) {
					if(this.pluginsList[index].uuid == uuid){
						if(!this.pluginsList[index].active){
							this.pluginsList[index].active = true;
							//require("../../../plugins/" + this.pluginsList[index].module);
							Event.$emit('sidebarClose');
							Event.$emit("changeModule", plugin);
						}
					} else {
						this.pluginsList[index].active = false;
					}
				}
			}
		}
	}
</script>

<style>
</style>