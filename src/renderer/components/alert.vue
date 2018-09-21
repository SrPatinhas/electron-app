<template>
	<!-- -------------------------------- -->
	<!-- SPECIFIC FOR CONNECTION WARNINGS -->
	<!-- -------------------------------- -->
	<div></div>
</template>

<script>
	const ipcRenderer = require('electron').ipcRenderer;

	export default {
		name: "alert",
		data() {
			return {
				color: "#000000",
				opacity: 0.5,
				time: 2000,
				native: false, //if true, show native OS notification
				notificationSystem: {
	                options: {
	                    show: {
	                        theme: 'dark',
	                        icon: 'icon-person',
	                        position: 'topCenter',
	                        progressBarColor: 'rgb(0, 255, 184)',
	                        buttons: [
	                            ['<button>Ok</button>', function (instance, toast) {
	                                alert("Hello world!");
	                            }, true],
	                            ['<button>Close</button>', function (instance, toast) {
	                                instance.hide({
	                                    transitionOut: 'fadeOutUp',
	                                    onClosing: function(instance, toast, closedBy){
	                                        console.info('closedBy: ' + closedBy);
	                                    }
	                                }, toast, 'buttonName');
	                            }]
	                        ],
	                        onOpening: function(instance, toast){
	                            console.info('callback abriu!');
	                        },
	                        onClosing: function(instance, toast, closedBy){
	                            console.info('closedBy: ' + closedBy);
	                        }
	                    },
	                    ballon: {
	                        balloon: true,
	                        position: 'bottomCenter'
	                    },
	                    info: {
	                        position: 'bottomLeft'
	                    },
	                    success: {
	                        position: 'bottomRight'
	                    },
	                    error: {
	                        position: 'topRight'
	                    },
	                }
            	}
        	}
		},
		created() {
			let self = this;
			Event.$on('notification', function (options) {
				self.showNotification(options);
			});
		},
		methods: {
			showNotification(options){
				/*
				 * Options
				 * - type [info/success/error]
				 * - Desktop [true/False]: It will show a native notification
				 * - Title
				 * - Text
				 * - Image
 				 */
				if(options.desktop){
					this.OS_Show(options);
				}
				this.$toast.show(options.title, options.text, notificationSystem.options[options.type]);
				//this.$toast.show(options.title, options.text, notificationSystem.options.info);
				//this.$toast.show(options.title, options.text, notificationSystem.options.success);
				//this.$toast.show(options.title, options.text, notificationSystem.options.error);

			},
			OS_Show(options){
				// Do this from the renderer process
				var notif = new window.Notification(options.title, {
					body: options.text,
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