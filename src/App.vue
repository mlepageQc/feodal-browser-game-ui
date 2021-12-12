<template>
  <router-view 
    id="app-spinner"
    name="spinner"
    v-if="!initialized" />
  <router-view
    name="header" />
  <div id="main">
    <router-view
      name="nav" />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent  } from 'vue'
import { mapState } from 'vuex'


export default defineComponent({
  computed: {
    ...mapState([
      'initialized'
    ])
  }
})
</script>

<style lang="scss">
  @import './assets/stylesheets/constants.scss';
  @import './assets/stylesheets/reset.scss';

  body {
    margin: 0;
    height: 100vh;
    font-family: $base-font;
    background: white;
  }
  #app {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  #bottom {
    display: flex;
    flex-grow: 1;
  }
  #main {
    display: flex;
    flex-grow: 1;
  }
  main {
    display: flex;
    flex-grow: 1;
  }
</style>
