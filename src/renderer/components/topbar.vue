<template>
	<div class="bar title-bar">
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
	.bar {
		height: 30px;
		width: 100%;
		box-sizing: border-box;
		font-size: 0;
		-webkit-user-select: none;
		-webkit-app-region: drag;
		 background: #efefef;
	}
	.cell {
		display: inline-block;
		margin: 0;
		height: 30px;
		box-sizing: border-box;
		-webkit-user-select: none;
		-webkit-app-region: drag;
	}
	.cell.window-controls {
		width: 54px;
		padding: 0px 2px 0px 2px;
	}
	.cell.window-controls .btn {
		margin-top: 10px;
	}
	.cell.tabs {
		width: calc(100% - 175px);
		padding: 0px;
	}
	.cell.tabs .new-tab {
		float: left;
		-webkit-app-region: no-drag;
	}
	.cell.tabs .tab {
		display: block;
		float: left;
		margin: 7.5px 0px 0px 10px;
		width: 15px;
		height: 15px;
		background: #bbb;
		border-radius: 50%;
		transition: 90ms;
		-webkit-app-region: no-drag;
	}
	.cell.tabs .tab.inactive {
		-webkit-filter: opacity(45%) grayscale(30%);
						filter: opacity(45%) grayscale(30%);
	}
	.cell.tabs .tab.active {
		-webkit-transform: scale(1.5);
						transform: scale(1.5);
	/*width: 22px
					height: 22px
					margin: 4px 0px 0px 10px*/
		-webkit-filter: opacity(100%) grayscale(0%);
						filter: opacity(100%) grayscale(0%);
	}
	.cell.tabs .tab img {
		object-fit: contain;
		width: 100%;
		height: 100%;
	}
	.cell.tabs svg {
		display: block;
		width: 30px;
		height: 30px;
		padding: 7.5px;
		box-sizing: border-box;
		border-radius: 50%;
		transition: 180ms;
		margin: 0 auto;
	}
	.cell.tabs svg:active {
		background: rgba(0,0,0,0.125);
	}
	.cell.tabs svg path {
		fill: none;
		stroke: #999;
		stroke-width: 2px;
		-webkit-transform-origin: center;
						transform-origin: center;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.cell.tabs svg path.plus {
		d: path("M8,4 L8,12 M4,8 L12,8");
	}
	.cell.navigation {
		width: 30px;
		padding-top: 5px;
		-webkit-app-region: no-drag;
	}
	.cell.navigation svg {
		display: block;
		float: right;
		height: 16px;
		width: 16px;
		padding: 3px;
		border-radius: 50%;
		transition: 180ms;
	}
	.cell.navigation svg:active {
		background: rgba(0,0,0,0.125);
	}
	.cell.navigation svg path {
		fill: none;
		stroke: #000;
		stroke-width: 2px;
		-webkit-transform-origin: center;
						transform-origin: center;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.cell.navigation svg path.burger {
		d: path("M3,4 L13,4 M3,8 L13,8 M3,12 L13,12");
	}
	.btn.window {
		display: block;
		width: 10px;
		height: 10px;
		margin-left: 7px;
		border-radius: 50%;
		float: left;
		-webkit-app-region: no-drag;
	}
	.btn.window.red {
		margin-left: 3px;
		background: #e7524b;
	}
	.btn.window.yellow {
		background: #efca00;
	}
	.btn.window.green {
		background: #3fc772;
	}

.os_windows {
		float: right;
		-webkit-app-region: no-drag;
		z-index: 3;
}
	.title-bar .os_windows div {
		position: relative;
		float: left;
		width: 35px;
		height: 30px;
	}

.title-bar .os_windows div:before,
.title-bar .os_windows div:after {
	top: 30%;
	right: 30%;
	bottom: 30%;
	left: 30%;
	content: " ";
	position: absolute;
	border-color: #888888;
	border-style: solid;
	border-width: 0 0 2px 0;
}

.title-bar .os_windows .minimize:before {
	border-bottom-width: 2px;
}

.title-bar .os_windows .maximize:before {
	border-width: 1px 1px 2px 1px;
}

.title-bar .os_windows .close:before,
.title-bar .os_windows .close:after {
	bottom: 50%;
	top: 50%;
}

.title-bar .os_windows .close:before {
	transform: rotate(45deg);
}

.title-bar .os_windows .close:after {
	transform: rotate(-45deg);
}

.title-bar .os_windows div:hover {
	background-color: #CCCCCC;
}

.title-bar .os_windows .close:hover {
	background-color: #E04343;
}

.title-bar .os_windows div:hover:after,
.title-bar .os_windows div:hover:before {
	border-color: #333333;
}

.title-bar .os_windows .close:hover:after,
.title-bar .os_windows .close:hover:before {
	border-color: #FFFFFF;
}


.title-bar__burger {
	display: block;
	position: relative;
	float: left;
	overflow: hidden;
	margin: 0;
	padding: 0;
	width: 38px;
	height: 30px;
	font-size: 0;
	text-indent: -9999px;
	appearance: none;
	box-shadow: none;
	border-radius: none;
	border: none;
	cursor: pointer;
	background:none;

	&:focus {
		outline: none;
	}
}

.burger__lines {
	display: block;
	position: absolute;
	width: 18px;
	top: 15px;
	left: 0;
	right: 0;
	margin: auto;
	height: 1px;
	background: $black;

	&:before,
	&:after {
		position: absolute;
		display: block;
		left: 0;
		width: 100%;
		height: 1px;
		background-color: $black;
		content: "";
	}

	&:before {
		top: -5px;
	}

	&:after {
		bottom: -5px;
	}
}
</style>