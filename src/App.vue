<template>
  <Header />
  <main class="main">
    <Nav class="main--nav" />
    <Content class="main--content" />
  </main>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Header from './components/layout/Header.vue'
import Nav from './components/layout/Nav.vue'
import Content from './components/layout/Content.vue'

@Options({
  components: {
    Header,
    Nav,
    Content
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
  #app {
    display: flex;
    flex-direction: column;
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
