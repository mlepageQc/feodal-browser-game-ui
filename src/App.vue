<template>
  <Header />
  <main class="main">
    <MainNav class="main--nav" />
    <router-view />
  </main>
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
    font-family: $base-font;
  }
  #app {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  main {
    display: flex;
    flex-grow: 1;
    &--nav {
      height: 100%;
    }
    &--content {
      height: 100%;
      flex-grow: 1;
    }
  }
</style>
