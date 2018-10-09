<template>
	<div>
		<section :class='[open ? "menuWrap openSidebar" : "menuWrap"]'>
			<div class="menu">
				<div class="me userBg">
					<div class="image"></div>

					<div class="myinfo">
						<p class="name">Random Name</p>
						<p class="phone">+1 12 1234 5678</p>
					</div>

					<button class="settings" @click="toggleSettings">
						<i class="fas fa-cog"></i>
					</button>

					<button class="cloud">
						<i class="fas fa-sign-out-alt"></i>
					</button>
				</div>
				<nav>

					<button v-for="app in pluginsList" :class="['ng', app.active ? 'active' : '']" @click="changePlugin(app.uuid, app.module)">
						<img :src="app.icon" :alt="app.module">
						<span>{{ app.label }}</span>
					</button>
				</nav>

				<div class="info">
					<p>Dreamovies App</p>
					<p>Ver 0.0.1 - <a href="https://dreamovies.tk/app">About</a></p>
					<p>App coded by: <a href="https://www.github.com/srpatinhas">SrPatinhas</a></p>
				</div>
			</div>
		</section>
		<overlay></overlay>
	</div>
</template>

<script>
	import overlay from "./overlay";

	export default {
		name: "sidebar",
		components:{
			overlay
		},
		props:{
			open: true
		},
		data() {
			return {
				pluginsList: window.pluginList,
			}
		},
		methods: {
			changePlugin(uuid, plugin){
				for (let index in this.pluginsList) {
					if(this.pluginsList[index].uuid == uuid){
						if(!this.pluginsList[index].active){
							this.pluginsList[index].active = true;
							//require("../../../plugins/" + this.pluginsList[index].module);
							Event.$emit("changeModule", plugin);
						}
					} else {
						this.pluginsList[index].active = false;
					}
				}
			},
			toggleSettings(){
                Event.$emit('toggleSettings');
			},
		},
	}
</script>

<style>

a {
	text-decoration: none;
}

button {
	cursor: pointer;
}

button, input[type="search"], input[type="text"] {
	border: none;
	outline: none;
}

input[type="checkbox"] {
	margin: 7px;
	margin-right: 15px;
}

/* FIRST, THE OVERLAY ELEMENTS */

.alerts {
	position: absolute;
	bottom: 10px;
	left: 10px;
	z-index: 9999;
	padding: 10px;
	color: #666;
	border-radius: 4px;
	background: #FFF;
	box-shadow: 0 0 7px 0 rgba(0,0,0,0.4);
	display: none;
}
	/* side menu */
.menuWrap {
	position: absolute;
	left: -320px;
	width: 30%;
	min-width: 240px;
	max-width: 320px;
    height: 100%;
	z-index: 3;
    top: 0;
    transition: all .3s ease-in-out;
}

.menu {
	position: relative;
	width: 100%;
	height: 100%;
	float: left;
	background: #FFF;
	box-shadow: 0 0 7px 0 rgba(0,0,0,0.4);
}

.menuWrap.openSidebar{
	opacity: 1;
	left: 0;
}

.me {
	position: relative;
	width: calc(100% - 50px);
	height: 140px;
	background: #419fd9;
	padding: 15px 25px;
	margin-bottom: 15px;
}

.me .image {
	width: 70px;
	height: 70px;
	background: #FFF url(http://4.bp.blogspot.com/-BHhUazKytmw/VbCfWPqrOJI/AAAAAAAAB7c/qj6WVX3du-s/s1600/51b91bba5a3fd9b6c8b9c53bc0ab6c65.jpg) no-repeat center;
	background-size: cover;
	border-radius: 100%;
	cursor: pointer;
}

.me .settings {
	position: absolute;
	right: 20px;
	bottom: 65px;
	width: 40px;
	height: 40px;
	padding-top: 2px;
	color: #FFF;
	border-radius: 100%;
	background: rgba(0, 0, 0, 0.15);
}

.me .settings:hover {
	background: rgba(0, 0, 0, 0.35);
}

.me .cloud {
	position: absolute;
	right: 20px;
	bottom: 15px;
	width: 40px;
	height: 40px;
	color: #FFF;
	border-radius: 100%;
	background: rgba(0, 0, 0, 0.09);
}

.me .cloud:hover {
	background: rgba(0, 0, 0, 0.35);
}

.me .myinfo {
	position: absolute;
	bottom: 15px;
	font-size: 14px;
	color: #FFF;
}

.myinfo .name {
	font-weight: 600;
	margin-bottom: 5px;
}

.myinfo .phone {
	font-weight: 300;
}

nav button {
	width: 100%;
	height: 45px;
	background: #FFF;
	text-align: left;
	padding-left: 20px;
	color: #666;
}
nav button img{
    object-fit: cover;
    width: 25px;
    display: inline-flex;
}

nav {
	float: left;
	width: 100%;
	height: auto;
	max-height: 350px;
	overflow-x: hidden;
	overflow-y: auto;
}

nav button:hover {
	background: #EEE;
}

nav button > i {
	color: #999;
	float: left;
}

nav button > span {
	display: inline-block;
	margin-top: 5px;
	margin-left: 20px;
	font-weight: 600;
	font-size: 14px;
}

.info {
	position: absolute;
	left: 20px;
	bottom: 15px;
	font-size: 12px;
	color: #666;
}
</style>