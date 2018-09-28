<template>
    <div class="ui grid ui-chat">
        <div :class="['video-call', (call.showCall ? 'show-call' : '')]">
            <button @click="endCall" class="ui circular inverted red button">
                <i class="times icon"></i>
            </button>
            <video class="local-video" :src="call.local_video" id="localVideo" autoplay muted></video>
            <video class="remote-video" :src="call.remote_video" id="remoteVideo" autoplay></video>
        </div>

        <div class="four wide column contacts-list">
            <!-- contact-list -->
            <div class="ui secondary vertical fluid menu">
                <div class="item">
                    <div class="ui transparent icon input">
                        <input type="text" placeholder="Search contacts...">
                        <i class="search icon"></i>
                    </div>
                </div>
                <!-- contact-item -->
                <a v-for="(item, index) in contacts" :class="['item', (item.active ? 'active' : '')]" @click="changeContact(index)">
                    <span>
                        <span :class="['ui', (item.online ? 'green' : 'grey'), 'empty', 'circular', 'label']"></span>
                    </span>
                    <img class="ui avatar image" :src="item.avatar" />
                    {{ item.name }}
                    <div v-if="item.unread > 0" class="ui olive circular label">{{ item.unread }}</div>
                </a>
            </div>

        </div>
        <div class="twelve wide column messages-info">
            <div class="ui segments">
                <!-- message-header -->
                <div class="ui clearing segment">
                    <div class="ui right floated header">
                        <button @click="startCall" class="circular green ui icon button">
                            <i class="icon phone"></i>
                        </button>
                        <button class="circular red ui icon button">
                            <i class="user times icon"></i>
                        </button>
                    </div>
                    <div class="ui left floated header">
                        <img :src="contact_active.avatar" class="ui circular image">
                        {{ contact_active.name }}
                    </div>
                </div>

                <!-- message-list -->
                <div class="ui segment messages-list">
                    <div class="ui minimal comments chat-messages vertical segment">
                        <!-- message-item -->
                        <div v-for="comment in messages" :class="[ (comment.sent ? 'right' : 'left'), 'aligned ui segment basic']">
                            <div class="ui compact segment comment">
                                <div class="content">
                                    <a v-if="!comment.sent" class="author">{{ comment.author }}</a>
                                    <div class="metadata">
                                        <span class="date">Today at 5:42PM - {{ comment.date }}</span>
                                    </div>
                                    <a v-if="comment.sent" class="author">{{ comment.author }}</a>
                                    <div class="text">
                                        {{ comment.message }}
                                    </div>
                                    <div v-if="comment.media.length > 0" class="extra ui tiny images">
                                        <img v-for="media in comment.media" class="ui image" :src="media.url" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="isWriting" class="left aligned ui segment basic">
                            <div class="ui compact segment comment">
                                <div class="content">
                                    <div class="text">
                                        <span class="ui grey empty circular label"></span>
                                        <span class="ui grey empty circular label"></span>
                                        <span class="ui grey empty circular label"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- message-input -->
                <div class="ui secondary segment chatbox__row">
                    <div class="enter">
                        <div class="enter__submit">
                            <button class="button button_id_submit" @click="sendMessage">
                                <i class="fa fa-paper-plane" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div class="enter__textarea">
                            <textarea v-model="message" name="enterMessage" id="enterMessage" cols="30" rows="2" placeholder="Say message..."></textarea>
                        </div>
                        <div class="enter__icons">
                            <a href="#" class="enter__icon">
                                <i class="fa fa-paperclip" aria-hidden="true"></i>
                            </a>
                            <a href="#" class="enter__icon">
                                <i class="fa fa-smile-o" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "messageChat",
        data() {
            return {
                config: {
                    label: "Chat",
                    icon: "http://www.myiconfinder.com/uploads/iconsets/256-256-c8b6cbadb620f8b3f588bf53464c8ab9.png",
                    background: "orange",
                    url: "https://dreamovies.tk/api/"
                },
                contacts: [
                    {
                        id: 1,
                        name: "Camila",
                        unread: 2,
                        avatar: "https://semantic-ui.com/images/avatar2/small/lindsay.png",
                        online: false,
                        lastSeen : new Date(),
                        item_active: false,
                    },
                    {
                        id: 2,
                        name: "Mike",
                        unread: 0,
                        avatar: "https://semantic-ui.com/images/avatar2/small/lindsay.png",
                        online: false,
                        lastSeen : new Date(),
                        item_active: false,
                    },
                    {
                        id: 3,
                        name: "John",
                        unread: 0,
                        avatar: "https://semantic-ui.com/images/avatar2/small/lindsay.png",
                        online: false,
                        lastSeen : new Date(),
                        item_active: false,
                    },
                    {
                        id: 4,
                        name: "Joe",
                        unread: 0,
                        avatar: "https://semantic-ui.com/images/avatar2/small/lindsay.png",
                        online: false,
                        lastSeen : new Date(),
                        item_active: false,
                    },
                    {
                        id: 5,
                        name: "Matt",
                        unread: 1,
                        avatar: "https://semantic-ui.com/images/avatar2/small/lindsay.png",
                        online: false,
                        lastSeen : new Date(),
                        item_active: false,
                    }
                ],
                contact_active: null,
                messages: [],
                comment: {
                    sent: null,
                    author: null,
                    date: null,
                    message: null,
                    media: [
                        {
                            url: null,
                            size: null,
                            filename: null,
                        }
                    ]
                },
                call:{
                    showCall: false,
                    stream: null,
                    local_video: null,
                    remote_video: null,
                    contact: null,
                },
                message: null,
                isWriting: false,
            }
        },
        created() {
            this.contacts[0].item_active = true;
            this.contact_active = this.contacts[0];
            this.getMessages();
        },
        methods: {
            /*
             *  Video Calls
             */
            startCall(user){
                console.log("start call");
                let self = this;

                navigator.mediaDevices.getUserMedia({audio:true,video:true})
                    .then(stream => {
                        self.call.stream = stream;
                        self.call.showCall = true;
                        self.call.local_video = URL.createObjectURL(stream);
                    })
                    .catch( (err) =>{
                        console.log(err);
                    });
            },
            endCall(){
                // later you can do below
                // stop both video and audio
                this.call.stream.getTracks().forEach( (track) => {
                    track.stop();
                });
                this.call.showCall = false;
                this.call.stream = null;
                // stop only audio
                //this.stream.getAudioTracks()[0].stop();
                //stop only audio
                //this.stream.getVideoTracks()[0].stop();
            },
            /*
             *  Send Message
             */
            sendMessage(){
                console.log(this.message);
            },
            changeContact(index){
                this.contacts.forEach(function(contact){
                    contact.item_active = false;
                });

                this.contacts[index].item_active = true;
                this.contact_active = this.contacts[index];
                this.getMessages();
            },
            getMessages(){
                this.messages = [];

                let comment = function(media, name){
                    let random_bool = Math.random();
                    let msg = {
                        sent: random_bool >= 0.5,
                        author: (random_bool >= 0.5 ? 'me' : name),
                        date: new Date(),
                        message: Math.random().toString(36).substring(7),
                        media: []
                    };
                    if(media > 0){
                        for (let i = 0; i < media; i++) {
                            msg.media.push(
                                {
                                    url: "https://semantic-ui.com/images/avatar2/small/lindsay.png",
                                    size: "123Kb",
                                    filename: "lindsay",
                                });
                        }
                    }
                    return msg;
                };
                this.messages.push(comment(0, this.contact_active.name));
                this.messages.push(comment(0, this.contact_active.name));
                this.messages.push(comment(2, this.contact_active.name));
                this.messages.push(comment(3, this.contact_active.name));
                this.messages.push(comment(0, this.contact_active.name));
                this.messages.push(comment(0, this.contact_active.name));
                this.messages.push(comment(0, this.contact_active.name));
            },
            writing(){
                this.isWriting = !this.isWriting;
            }
        }
    }
</script>
<style>
    .ui-chat{
        position: relative;
        width: 100%;
        height: 100%;
        background: #565656;
    }
    .ui-chat .contacts-list {
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: #d0d0d0;
        box-shadow: 1px 0 4px #8c8c8c;
        z-index: 2;
    }
    .ui-chat .messages-info{
        position: fixed;
        right: 0;
        top: 0;
        height: 100%;
        background: #f3f3f3;
        z-index: 1;
    }
    .messages-info > .segments{
        height: 100%;
        position: relative;
    }
    .messages-list{
        max-height: calc(100% - 80px - 125px);
        overflow: auto;
        box-shadow: inset 0 1px 2px #9e9e9e;
    }

    .ui-chat .minimal.comments.chat-messages.vertical.segment{
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        max-width: 100%;
    }
    .ui-chat .minimal.comments.chat-messages.vertical.segment .compact.segment{
        display: inline-block;
    }
    /* enter block */

    .enter {
        position: relative;
        padding-top: 12px;
        padding-bottom: 14px;
    }

    .enter:before {
        background-color: #edeef1;
        height: 2px;
        width: 100%;
        content: '';
        position: absolute;
        bottom: 100%;
        left: 0;
    }

    .enter__submit {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        width: 38px;
        height: 38px;
        border: 2px solid #e2e3e7;
        border-radius: 50%;
        background-color: #fff;
        text-align: center;
    }

    .enter__textarea {
        padding-right: 50px;
    }

    .enter__textarea textarea {
        width: 100%;
        border: none;
        resize: none;
    }

    .enter__icons {
        padding-right: 50px;
        font-size: 0;
        display: flex;
        align-items: center;
        margin-top: 6px;
    }

    .enter__icons .fa-paperclip {
        font-size: 16px;
        color: grey;
    }

    .enter__icons .fa-smile-o {
        font-size: 16px;
        color: grey;
    }

    .enter__icon {
        margin-right: 12px;
    }
    .app-content .video-call{
        display: none;
    }
    .app-content .video-call.show-call {
        height: calc(100% - 30px);
        width: 100%;
        position: fixed;
        top: 30px;
        left: 0;
        background: gray;
        z-index: 9;
        display: block;
        padding: 0;
        margin: 0;
    }
    .video-call button{
        position: absolute;
        top: 20px;
        right: 20px;
    }
    .video-call .local-video{
        width: 300px;
        height: 300px;
        background: #0f0f10;
        position: absolute;
        right: 20px;
        bottom: 20px;
        -webkit-box-shadow: 0px 0px 3px #000;
        -moz-box-shadow: 0px 0px 3px #000;
        box-shadow: 0px 0px 3px #000;
        z-index: 9;
    }
    .video-call .remote-video{
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 7;
    }
</style>