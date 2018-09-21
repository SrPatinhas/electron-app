<template>
  <section class="overlay" @click="toggleSidebar">
    <!-- DARK FRAME OVERLAY -->
  </section>
</template>

<script>
  export default {
    data() {
      return {
        color: "#000000",
        opacity: 0.5
      }
    },
    methods: {
      toggleSidebar(){
        Event.$emit('sidebarToggle');
      },
    }
  }
</script>
<style>
  /* dark overlay element */
  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    opacity: 0;
    z-index: 2;
    display: none;
    transition: all .3s ease-in-out;
  }

  .overlay-show .overlay {
    display: block;
    opacity: 1;
  }
</style>