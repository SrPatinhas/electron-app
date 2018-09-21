<template>
  <div>
    Test chat    
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
        checked: false,
        title: 'Check me'
      }
    },
    methods: {
      check() {
        this.checked = !this.checked;
      }
    }
  }
</script>