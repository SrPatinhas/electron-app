<template>
	<section>
		<div :class="[torrentInfo.isDone ? 'is-seed' : '']">
			<div v-if="view == 'ExternalLink'"><!-- ExternalLink -->
				<form class="ui form">
					<div class="field">
						<label>External Link</label>
						<textarea v-model="externalLink" placeholder="External Link / Magnetic Link"></textarea>
					</div>
					<div class="field">
						<label>Type</label>
						<div class="ui selection">
							<select id="external-type" v-model="externaType">
								<option value="">Type</option>
								<option value="1">WebPage</option>
								<option value="2">Video</option>
								<option value="3">Embed</option>
								<option value="4">Torrent</option>
							</select>
						</div>
					</div>
					<button class="ui button" @click="OpenLink">Submit</button>
				</form>
			</div>
			<div v-else-if="view == 'TorrentExplorer'"><!-- TorrentExplorer -->
				<div class="ui show-content external-content"></div>
			</div>

			<div v-else-if="view == 'TorrentView'" class="ui show-content external-content"><!-- TorrentExplorer -->
				<div id="hero">
					<div id="output">
						<div id="progressBar" :style="'width:' + torrentInfo.progressBar"></div>
						<video id="video_stream" controls></video>
					</div>
					<!-- Statistics -->
					<div id="status">
						<div>
							<span class="show-leech">Downloading </span>
							<span class="show-seed">Seeding </span>
							<code>
								<a id="torrentLink"></a>
							</code>
							<span class="show-leech"> from </span>
							<span class="show-seed"> to </span>
							<code id="numPeers">{{ torrentInfo.numPeers }}</code>.
						</div>
						<div>
							<code id="downloaded">{{ torrentInfo.downloaded }}</code> of 
							<code id="total">{{ torrentInfo.total }}</code> — 
							<span id="remaining">{{ torrentInfo.remaining }}</span>
							<br/>
							&#x2198;<code id="downloadSpeed">{{ torrentInfo.downloadSpeed }}</code> / &#x2197;<code id="uploadSpeed">{{ torrentInfo.uploadSpeed }}</code>
						</div>
						<span id="file-url"></span>
					</div>
				</div>
			</div>

			
			<div v-else-if="view == 'ExternalView'"><!-- ExternalView -->
				<div>
					<div v-if="type == 1">
						<iframe class="iframe-external" :src="link" onload="this.style.height=this.contentDocument.body.scrollHeight +\'px\';" webkitallowfullscreen="true" allowfullscreen="true" frameborder="0" scrolling="no" sandbox="allow-forms allow-scripts allow-same-origin allow-pointer-lock"></iframe>
					</div>
					<div v-if="type == 2">
						<video width="320" height="240" controls><source :src="link" type="video/mp4" /></video>
							<!-- https://openload.co/stream/ym7b-E18i54~1520423927~83.240.0.0~P71ysq_1?mime=true -->
					</div>
					<div v-if="type == 3">
						<div class="ui embed" data-url=' + link + '" data-placeholder="/images/image-16by9.png" data-icon="right circle arrow"></div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
	export default {
		name: 'torrentPlayer',
		data() {
			return {
				config: {
					label: "Torrent Player",
					icon: "https://www.shareicon.net/download/2016/07/07/116749_software_512x512.png",
					background: "orange",
					url: "https://dreamovies.tk/api/"
				},
				view: 'ExternalLink',
				type: 0,
				externaType: '',
				externalLink: '',
				torrentObject: null,
				torrentInfo: {
					numPeers: '0 peers',
					progressBar: '0',
					remaining: '0',
					downloaded: '0',
					downloadSpeed: '0 b/s',
					uploadSpeed: '0 b/s',
					total: '0',
					isDone: false
				}
			}
		},
		methods: {
			check() {
				this.checked = !this.checked;
			},

			ExternalVideo(){
				//Get video from js
				var ifrm = document.getElementsByTagName('iframe')[0];
				var win = ifrm.contentWindow; // reference to iframe's window
				var doc = ifrm.contentDocument;
				var vi_ifrm = doc.getElementsByTagName('iframe')[0];
				var vi = vi_ifrm.contentDocument;
				var ol_vi = vi_ifrm.contentWindow.videojs('olvideo');
				//check if video started
				console.log(ol_vi.hasStarted());
				//get current percentage 
				(ol_vi.currentTime() * 100 / ol_vi.duration()).toFixed(2) + "%";
				//get time reamining
				var totalNumberOfSeconds = ol_vi.remainingTime();
				var hours = parseInt( totalNumberOfSeconds / 3600 );
				var minutes = parseInt( (totalNumberOfSeconds - (hours * 3600)) / 60 );
				var seconds = Math.floor((totalNumberOfSeconds - ((hours * 3600) + (minutes * 60))));
				var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
				console.log(result);

			},
			OpenTorrent(){
				require('webtorrent-hybrid');
				var magnetURI = this.externalLink;

				//util_tools.createLoading();

				console.log("Torrent Link/file Loading");

				/*/ Select the node that will be observed for mutations
				var targetNode = document.getElementById('output');
				// Options for the observer (which mutations to observe)
				var config = { attributes: false, childList: true };
				// Create an observer instance linked to the callback function
				var observer = new MutationObserver(function(mutations) {
					if (!document.body.contains(element)) {
						
						// Later, you can stop observing
						observer.disconnect();
					}
				});
				// Start observing the target node for configured mutations
				observer.observe(targetNode, config);*/

				//https://webtorrent.io/docs
				var torrentId = magnetURI; 
				//'https://webtorrent.io/torrents/sintel.torrent';
				//'https://zoink.ch/torrent/Marvels.Agents.of.S.H.I.E.L.D.S05E12.HDTV.x264-SVA[eztv].mkv.torrent'
				var client = new WebTorrent();

				this.view = "TorrentView";

				client.on('error', function (err) {
					console.error('ERROR: ' + err.message)
				});
				// Download the torrent
				client.add(torrentId, {path: "C:/Users/user/Documents/Download/torrent"}, function (torrent) {

					var file_index = 0;
					// create HTTP server for this torrent
					var server = torrent.createServer();
					server.listen(8888); // start the server listening to a port

					// Torrents can contain many files. Let's use the .mp4 file
					var file = torrent.files.find(function (file) {
						if( file.name.endsWith('.mp4') ){
							console.log(file);
							//file_index = file;
							return file.name.endsWith('.mp4');
						} else if( file.name.endsWith('.mkv') ){
							console.log(file);
							return file.name.endsWith('.mkv');
						}
						file_index++;
					});

					// Stream the file in the browser
					//file.createReadStream()
					file.renderTo('#video_stream');
					// Stream the file in the browser
			        file.appendTo('#output', function (err, elem) {
						if (err) throw err // file failed to download or display in the DOM
						console.log('New DOM node with the content', elem)
					});


					// visit http://localhost:<port>/ to see a list of files
					// access individual files at http://localhost:<port>/<index> where index is the index
					// in the torrent.files array
					//document.getElementById('video_stream').setAttribute("src", "http://localhost:8888/" + file_index);

					document.getElementById('torrentLink').innerHTML = file.name;

					file.getBlobURL(function (err, url) {
						if (err) throw err;
						var a = document.createElement('a');
						a.download = file.name;
						a.href = url;
						a.title = file.path;
						a.textContent = 'Download ' + file.name;
						document.getElementById("file-url").appendChild(a);
					});
					
					torrent.on('ready', function () {
						util_tools.createNotification('Download Started', torrent.name);
					});
						
					torrent.on('warning', function (err) {
						console.log(err);
					});
					torrent.on('error', function (err) {
						console.log(err);
						//server.close();
						//client.destroy();
					});

					// Trigger statistics refresh
					torrent.on('done', onDone);
					setInterval(onProgress, 500);
					onProgress();


					// Human readable bytes util
					function prettyBytes(num) {
						var exponent, unit, neg = num < 0, units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
						if (neg)
							num = -num;
						if (num < 1)
							return (neg ? '-' : '') + num + ' B';
						exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1);
						num = Number((num / Math.pow(1000, exponent)).toFixed(2));
						unit = units[exponent];
						return (neg ? '-' : '') + num + ' ' + unit;
					}
					// Statistics
					function onProgress () {
						// Peers
						this.torrentInfo.numPeers = torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers');

						// Progress
						var percent = Math.round(torrent.progress * 100 * 100) / 100;
						this.torrentInfo.progressBar = percent + '%';
						this.torrentInfo.downloaded = prettyBytes(torrent.downloaded);
						this.torrentInfo.total = prettyBytes(torrent.length);

						// Remaining time
						var remaining;
						if (torrent.done) {
							remaining = 'Done.';
						} else {
							remaining = moment.duration(torrent.timeRemaining / 1000, 'seconds').humanize();
							remaining = remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.';
						}
						this.torrentInfo.remaining = remaining;

						// Speed rates
						this.torrentInfo.downloadSpeed = prettyBytes(torrent.downloadSpeed) + '/s';
						this.torrentInfo.uploadSpeed = prettyBytes(torrent.uploadSpeed) + '/s';
					}

					function onDone () {
						this.torrentInfo.isDone = true;
						onProgress();
						Event.$emit("notification", {
							desktop: true,
							type: "info",
							title: 'Download Complete', 
							text: 'Torrent Name: ' + torrent.name
						});

					}

					/*$("#dynamic-content").on('DOMNodeRemoved', function(e) {
						console.log(e.target, ' was removed');
						torrent.destroy(function(){
							console.log("torrent totally destroyed");
						});

						//server.close();
						//client.destroy();
					});*/

					function destroyStream(e){
						server.close();
						client.destroy();
						console.log("destroyed");
						document.getElementsByClassName('menu-list')[0].removeEventListener("click", destroyStream());
					}
					//destroy Torrent
					//document.getElementsByClassName('menu-list')[0].addEventListener("click", destroyStream() );

				});
			},
			OpenLink(){

				var link = this.externalLink;
				var type = this.externalType;
				
				if (!/^(f|ht)tps?:\/\//i.test(link)) {
					link = "http://" + link;
				}
				if(type == "4"){
					this.OpenTorrent();
				}

				//util_tools.createLoading();
				console.log("External Link loading: " + link);
				this.view = "ExternalView";
			},
			external(){
				//util_tools.createLoading();
				console.log("External Link Request");
				this.view = "ExternalLink";
			},
			torrentStart(){
				//util_tools.createLoading();
				console.log("Torrent Link/file Request");
				this.view = "TorrentView";
			},
		}
	}
</script>
<style>
#output video {
	width: 100%;
}
#progressBar {
	height: 5px;
	width: 0%;
	background-color: #35b44f;
	transition: width .4s ease-in-out;
}
body.is-seed .show-seed {
	display: inline;
}
body.is-seed .show-leech {
	display: none;
}
.show-seed {
	display: none;
}
#status code {
	font-size: 90%;
	font-weight: 700;
	margin-left: 3px;
	margin-right: 3px;
	border-bottom: 1px dashed rgba(255,255,255,0.3);
}

.is-seed #hero {
	background-color: #154820;
	transition: .5s .5s background-color ease-in-out;
}
#hero {
	background-color: #2a3749;
}
#status {
	color: #fff;
	font-size: 17px;
	padding: 5px;
}
a:link, a:visited {
	color: #30a247;
	text-decoration: none;
}
</style>