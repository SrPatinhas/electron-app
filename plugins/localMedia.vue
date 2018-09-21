<template>
  <div>
    Test localmedia    
  </div>
</template>

<script>
  export default {
    name: 'localmedia',
    data() {
      return {
        config: {
          label: "Local Media",
          icon: "https://pkief.gallerycdn.vsassets.io/extensions/pkief/material-icon-theme/3.6.0/1536611311790/Microsoft.VisualStudio.Services.Icons.Default",
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