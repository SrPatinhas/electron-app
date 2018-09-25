<template>
    <div class="ui grid ui-chat">
        <div class="five wide column contacts-list">
            <contact-list :list="contacts"></contact-list>
        </div>
        <div class="eleven wide column messages-list">
            <message-list></message-list>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';

    Vue.component('contact-list', {
        props: [
            'list'
        ],
        template: `
            <div class="ui middle aligned divided list">
                <div class="item">
                    <div class="ui input"><input type="text" placeholder="Search..."></div>
                </div>
                <div class="item" v-for="item in list">
                    <div class="right floated content">
                        <a class="ui olive circular label">{{ item.unread }}</a>
                    </div>
                    <a :class="['ui', (item.online ? 'green' : 'grey'), 'empty', 'circular', 'label']"></a>
                    <img class="ui avatar image" :src="item.avatar"/>
                    <div class="content">
                        {{ item.name }}
                    </div>
                </div>

            </div>
        `
    });
    Vue.component('message-list', {
        props: ['messages'],
        template: `
            <div>
                <div class="ui minimal comments">
                    <h3 class="ui dividing header">Comments</h3>
                    <div class="comment">
                        <a class="avatar">
                            <img src="https://semantic-ui.com/images/avatar/small/matt.jpg">
                        </a>
                        <div class="content">
                            <a class="author">Matt</a>
                            <div class="metadata">
                                <span class="date">Today at 5:42PM</span>
                            </div>
                            <div class="text">
                                How artistic!
                            </div>
                            <div class="actions">
                                <a class="reply">Reply</a>
                            </div>
                        </div>
                    </div>
                </div>

                <form class="ui reply form">
                    <div class="field">
                        <textarea></textarea>
                    </div>
                    <div class="ui blue labeled submit icon button">
                        <i class="icon edit"></i> Add Reply
                    </div>
                </form>
            </div>
        `
    });
    Vue.component('message-item-text', {
        props: ['post'],
        template: `
          <div class="blog-post">
            <h3>{{ post.title }}</h3>
            <div v-html="post.content"></div>
          </div>
        `
    });
    Vue.component('message-item-media', {
        props: ['post'],
        template: `
          <div class="blog-post">
            <h3>{{ post.title }}</h3>
            <div v-html="post.content"></div>
          </div>
        `
    });
    Vue.component('message-input', {
        props: ['post'],
        template: `
          <div class="blog-post">
            <h3>{{ post.title }}</h3>
            <div v-html="post.content"></div>
          </div>
        `
    });
    Vue.component('contacts-input', {
        props: ['post'],
        template: `
          <div class="blog-post">
            <h3>{{ post.title }}</h3>
            <div v-html="post.content"></div>
          </div>
        `
    });
    Vue.component('contacts-call', {
        props: ['post'],
        template: `
          <div class="blog-post">
            <h3>{{ post.title }}</h3>
            <div v-html="post.content"></div>
          </div>
        `
    });

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
                        id: 0,
                        name: "Camila",
                        unread: 0,
                        avatar: "https://semantic-ui.com/images/avatar2/small/lindsay.png",
                        online: false,
                        lastSeen : new Date()
                    },
                    {
                        id: 1,
                        name: "Camila",
                        unread: 0,
                        avatar: "https://semantic-ui.com/images/avatar2/small/lindsay.png",
                        online: false,
                        lastSeen : new Date()
                    },
                    {
                        id: 2,
                        name: "Camila",
                        unread: 0,
                        avatar: "https://semantic-ui.com/images/avatar2/small/lindsay.png",
                        online: false,
                        lastSeen : new Date()
                    },
                    {
                        id: 3,
                        name: "Camila",
                        unread: 0,
                        avatar: "https://semantic-ui.com/images/avatar2/small/lindsay.png",
                        online: false,
                        lastSeen : new Date()
                    },
                    {
                        id: 4,
                        name: "Camila",
                        unread: 0,
                        avatar: "https://semantic-ui.com/images/avatar2/small/lindsay.png",
                        online: false,
                        lastSeen : new Date()
                    }
                ]
            }
        },
        methods: {

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
        top: 30px;
        left: 0;
        background: #d0d0d0;
        box-shadow: 1px 0 4px #8c8c8c;
        z-index: 2;
    }
    .ui-chat .messages-list {
        position: fixed;
        right: 0;
        top: 30px;
        height: 100%;
        background: #f3f3f3;
        z-index: 1;
    }
</style>