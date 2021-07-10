<template>
  <Header />
  <div id="bottom">
    <MainNav />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent  } from 'vue'
import Header from './components/layout/Header.vue'
import MainNav from './components/layout/nav/MainNav.vue'

export default defineComponent({
  components: { Header, MainNav }
})
</script>

<style lang="scss">
  @import './assets/stylesheets/constants.scss';

  body {
    margin: 0;
    height: 100vh;
    min-width: 1024px;
    font-family: $base-font;
  }
  #app {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  #bottom {
    display: flex;
    flex-grow: 1;
  }
  main {
    display: flex;
  }
</style>
