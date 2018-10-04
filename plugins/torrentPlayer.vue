<template>
	<section :class="[torrentInfo.isDone ? 'is-seed' : '', 'torrent-plugin']">
		<div class="ui form" v-if="view == 'ExternalLink'"><!-- ExternalLink -->
			<div class="field">
				<label>External Link</label>
				<textarea v-model="externalLink" placeholder="External Link / Magnetic Link"></textarea>
			</div>
			<div class="field">
				<label>Type</label>
				<div class="ui selection">
					<select id="external-type" v-model="externalType">
						<option value="">Type</option>
						<option value="1">WebPage</option>
						<option value="2">Video</option>
						<option value="3">Embed</option>
						<option value="4">Torrent</option>
					</select>
				</div>
			</div>
			<button class="ui button" @click="OpenLink">Submit</button>
			<button class="ui button" @click="SearchTorrentShow(1)">Search In EZTV torrents</button>
			<button class="ui button" @click="SearchTorrentMovie(1)">Search In YTS torrents</button>
		</div>
		<div class="ui container segment show-content external-content" v-else-if="view == 'TorrentExplorer'">
			<!-- TorrentExplorer -->
			<div class="ui feed">
				<div class="event ui vertical segment" v-for="torrent in torrentResponse.torrents">
					<div class="label">
						<img v-if="torrentResponse.type == 'shows'" :src="torrent.small_screenshot">
						<img v-else-if="torrentResponse.type == 'movies'" :src="torrent.medium_cover_image">
					</div>
					<div class="content">
						<div class="date">
							<timeago v-if="torrentResponse.type == 'shows'" :datetime="humanTime(torrent.date_released_unix)" :auto-update="60"></timeago>
							<timeago v-else-if="torrentResponse.type == 'movies'" :datetime="torrent.date_uploaded" :auto-update="60"></timeago>
						</div>
						<div class="summary">
							<a>{{ torrent.title }}</a> -
							<span v-if="torrentResponse.type == 'shows'">
								Season: {{ torrent.season }} - Episode: {{ torrent.episode }}
							</span>
							<span v-else-if="torrentResponse.type == 'movies'">
								Year: {{ torrent.year }} - RunTime: {{ torrent.runtime }} - Language: {{ torrent.language }}
							</span>
						</div>
						<div class="extra text">
							<span v-if="torrentResponse.type == 'shows'">
								IMDB: {{ torrent.imdb_id }} - {{ humanSize(torrent.size_bytes) }}<br>
								Seeds: {{ torrent.seeds }} - Peers: {{ torrent.peers }}
								<div class="ui button" @click="OpenExternalTorrent(torrent.magnet_url)">See</div>
							</span>
							<span v-else-if="torrentResponse.type == 'movies'">
								<div class="ui button" v-for="quality in torrent.torrents" @click="OpenExternalTorrent(quality.url)">
									{{ quality.quality }} [Seeds: {{ quality.seeds }} - Peers: {{ quality.peers }}] ({{ quality.size }})
								</div>
							</span>
						</div>
					</div>
				</div>
			</div>
			<div class="ui buttons" v-if="torrentResponse.type == 'shows'">
				<button class="ui button" @click="SearchTorrentShow(1)">[1] First Page</button>
				<button class="ui button" @click="SearchTorrentShow(torrentResponse.page - 1)">[{{ torrentResponse.page - 1 }}] Previous Page</button>
				<button class="ui button disabled">[{{ torrentResponse.page }}] Current Page</button>
				<button class="ui button" @click="SearchTorrentShow(torrentResponse.page + 1)">[{{ torrentResponse.page + 1 }}] Next Page</button>
				<button class="ui button" @click="SearchTorrentShow(Math.ceil(torrentResponse.torrents_count / torrentResponse.limit))">[{{ Math.ceil(torrentResponse.torrents_count / torrentResponse.limit) }}] Last Page</button>
			</div>
			<div class="ui buttons" v-if="torrentResponse.type == 'movies'">
				<button class="ui button" @click="SearchTorrentMovie(1)">[1] First Page</button>
				<button class="ui button" @click="SearchTorrentMovie(torrentResponse.page - 1)">[{{ torrentResponse.page - 1 }}] Previous Page</button>
				<button class="ui button disabled">[{{ torrentResponse.page }}] Current Page</button>
				<button class="ui button" @click="SearchTorrentMovie(torrentResponse.page + 1)">[{{ torrentResponse.page + 1 }}] Next Page</button>
				<button class="ui button" @click="SearchTorrentMovie(Math.ceil(torrentResponse.torrents_count / torrentResponse.limit))">[{{ Math.ceil(torrentResponse.torrents_count / torrentResponse.limit) }}] Last Page</button>
			</div>
		</div>

		<div id="hero" v-else-if="view == 'TorrentView'" class="ui show-content external-content"><!-- TorrentExplorer -->
			<div id="output">
				<div id="progressBar" :style="'width:' + torrentInfo.progressBar"></div>
				<video id="video_stream" controls autoplay></video>
			</div>
			<!-- Statistics -->
			<div id="status">
				<div>
					<span class="show-leech">Downloading </span>
					<span class="show-seed">Seeding </span>
					<code>
						<a id="torrentLink">{{ torrentInfo.link }}</a>
					</code>
					<span class="show-leech"> from </span>
					<span class="show-seed"> to </span>
					<code id="numPeers">{{ torrentInfo.numPeers }}</code>.
				</div>
				<div>
					<code id="downloaded">{{ torrentInfo.downloaded }}</code> of
					<code id="total">{{ torrentInfo.total }}</code> —
					<span id="remaining"><timeago :datetime="torrentInfo.remaining" :auto-update="5"></timeago></span>
					<br/>
					&#x2198;<code id="downloadSpeed">{{ torrentInfo.downloadSpeed }}</code> / &#x2197;<code id="uploadSpeed">{{ torrentInfo.uploadSpeed }}</code>
				</div>
				<span id="file-url"></span>
			</div>
		</div>
		<!-- ExternalView -->
		<iframe
				v-else-if="view == 'ExternalView' && externalType == '1'"
				class="iframe-external"
				:src="externalLink"
				onload="this.style.height=this.contentDocument.body.scrollHeight + 'px;'"
				:height="iframe_height"
				webkitallowfullscreen="true"
				allowfullscreen="true"
				frameborder="0"
				sandbox="allow-forms allow-scripts allow-same-origin allow-pointer-lock">
		</iframe><!-- scrolling="no" -->
		<video v-else-if="view == 'ExternalView' && externalType == '2'" width="320" height="240" controls>
			<source :src="link" type="video/mp4" />
		</video>
		<!-- https://openload.co/stream/ym7b-E18i54~1520423927~83.240.0.0~P71ysq_1?mime=true -->
		<div v-else-if="view == 'ExternalView' && externalType == '3'" class="ui embed" :data-url="link" data-placeholder="/images/image-16by9.png" data-icon="right circle arrow">

		</div>
	</section>
</template>

<script>
    const app  		 = require('electron');
    const path 		 = require('path');
    const fs      	 = require('fs');
    const ipcMain 	 = require('electron').ipcMain;
    const WebTorrent = require('webtorrent-hybrid');

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
				externalType: '',
				externalLink: '',
				clientObject: null,
				torrentInfo: {
					numPeers: '0 peers',
					progressBar: '0',
					remaining: '0',
					downloaded: '0',
					downloadSpeed: '0 b/s',
					uploadSpeed: '0 b/s',
					total: '0',
					isDone: false,
					link: '',
				},
				torrentResponse: {
                    type: null,
                    torrents_count: 116179,
                    limit: 10,
                    page: 1,
                    torrents: [
                        {
                            id: 1246515,
                            imdb_id: "2390276",
                            title: "Highway Thru Hell S07E05 HDTV x264-aAF EZTV",
                            filename: "Highway.Thru.Hell.S07E05.HDTV.x264-aAF[eztv].mkv",
                            episode_url: "https://eztv.ag/ep/1246515/highway-thru-hell-s07e05-hdtv-x264-aaf/",
                            magnet_url: "",
                            torrent_url: "https://zoink.ch/torrent/Highway.Thru.Hell.S07E05.HDTV.x264-aAF[eztv].mkv.torrent",
                            hash: "a95c04a35f4b20f0199940a4442176e689f2c3b8",
                            peers: 17,
                            seeds: 9,
                            season: "7",
                            episode: "5",
                            size_bytes: "573749503",
                            large_screenshot: "//ezimg.ch/thumbs/highway-thru-hell-s07e05-hdtv-x264-aaf-large.jpg",
                            small_screenshot: "//ezimg.ch/thumbs/highway-thru-hell-s07e05-hdtv-x264-aaf-small.jpg",
                            date_released_unix: 1538585184,
                        },
                    ]
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
            humanSize(bytes, si) {
                    var thresh = si ? 1000 : 1024;
                    if(Math.abs(bytes) < thresh) {
                        return bytes + ' B';
                    }
                    var units = si
                        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
                        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
                    var u = -1;
                    do {
                        bytes /= thresh;
                        ++u;
                    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
                    return bytes.toFixed(1)+' '+units[u];
			},
			humanTime(time){
			    return new Date( time * 1000 );
			},
            SearchTorrentShow(page_number = 1){
                let self = this;
                self.torrentResponse.type = "shows";
                //EZTV
                //https://eztv.ag/api/get-torrents?limit=10&page=1
                //https://eztv.ag/api/get-torrents?imdb_id=6048596
                axios.get('https://eztv.ag/api/get-torrents', {
                    params: {
                        limit: self.torrentResponse.limit,
                        page: page_number,
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        self.torrentResponse.torrents = response.data.torrents;
                        self.torrentResponse.torrents_count = response.data.torrents_count;
                        self.torrentResponse.page = response.data.page;
                        self.view = 'TorrentExplorer';
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

			},
            SearchTorrentMovie(page_number = 1){
                let self = this;
                self.torrentResponse.type = "movies";
                //YTS.AG
                //https://yts.am/api#list_movies
                axios.get('https://yts.am/api/v2/list_movies.json', {
                    params: {
                        limit: self.torrentResponse.limit,
                        page: page_number,
                        sort_by:
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        self.torrentResponse.torrents_count = response.data.data.movie_count;
                        self.torrentResponse.torrents = response.data.data.movies;
                        self.torrentResponse.page = response.data.data.page_number;
                        self.view = 'TorrentExplorer';
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

			},
            OpenExternalTorrent(magnet){
				console.log(magnet);
                this.externalLink = magnet;
                this.OpenTorrent();
			},
			OpenTorrent(){
				var magnetURI = this.externalLink;
                let self = this;

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
				self.clientObject = new WebTorrent();

				self.view = "TorrentView";

                self.clientObject.on('error', function (err) {
					console.error('ERROR: ' + err.message)
				});
                // Download the torrent
                var home_path = "C:/Users/miguel.cerejo/Documents/Download/torrent";
                self.clientObject.add(torrentId, {path: home_path}, function (torrent) {

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
			        /*file.appendTo('#output', function (err, elem) {
						if (err) throw err; // file failed to download or display in the DOM
						console.log('New DOM node with the content', elem);
					});*/


					// visit http://localhost:<port>/ to see a list of files
					// access individual files at http://localhost:<port>/<index> where index is the index
					// in the torrent.files array
					//document.getElementById('video_stream').setAttribute("src", "http://localhost:8888/" + file_index);

                    self.torrentInfo.link = file.name;

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
					    console.log("Download Started");
						//util_tools.createNotification('Download Started', torrent.name);
					});
						
					torrent.on('warning', function (err) {
						console.log(err);
					});
					torrent.on('error', function (err) {
						console.log(err);
						//server.close();
						//self.clientObject.destroy();
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
						self.torrentInfo.numPeers = torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers');

						// Progress
						var percent = Math.round(torrent.progress * 100 * 100) / 100;
						self.torrentInfo.progressBar = percent + '%';
						self.torrentInfo.downloaded = prettyBytes(torrent.downloaded);
						self.torrentInfo.total = prettyBytes(torrent.length);

						// Remaining time
						var remaining;
						if (torrent.done) {
							remaining = 'Done.';
						} else {
							remaining = torrent.timeRemaining / 1000;
							// remaining = remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.';
						}
						self.torrentInfo.remaining = remaining;

						// Speed rates
						self.torrentInfo.downloadSpeed = prettyBytes(torrent.downloadSpeed) + '/s';
						self.torrentInfo.uploadSpeed = prettyBytes(torrent.uploadSpeed) + '/s';
					}

					function onDone () {
						self.torrentInfo.isDone = true;
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
						//self.clientObject.destroy();
					});*/

					function destroyStream(e){
						server.close();
						self.clientObject.destroy();
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
                    this.externalLink = "http://" + link;
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
	.external-content{

	}
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
	.torrent-plugin,
	.torrent-plugin > div,
	iframe{
		width: 100%;
		height: 100%;
		position: relative;
	}

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