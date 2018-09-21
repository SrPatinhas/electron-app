<template>
  <div>
    Test dreamovies    
  </div>
</template>

<script>
  export default {
    name: "Dreamovies",
    data() {
      return {
        config: {
          label: "Dreamovies",
          icon: "https://dreamovies.tk/favicon.png",
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