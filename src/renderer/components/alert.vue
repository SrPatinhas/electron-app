<template>
	<!-- -------------------------------- -->
	<!-- SPECIFIC FOR CONNECTION WARNINGS -->
	<!-- -------------------------------- -->
	<div class="alerts">
		{{ text }}
	</div>
</template>

<script>
	const ipcRenderer = require('electron').ipcRenderer;

	export default {
		props: {
			text
		},
		data() {
			return {
				color: "#000000",
				opacity: 0.5,
				time: 2000,
				native: false //if true, show native OS notification
			}
		},
		methods: {
			OS_Show(){
				// Do this from the renderer process
				var notif = new window.Notification('Download Complete', {
					body: torrent.name,
					silent: true // We'll play our own sound
				})

				// If the user clicks in the Notifications Center, show the app
				notif.onclick = function () {
					ipcRenderer.send('focusWindow', 'main')
				}
			}
		}
	}
</script>