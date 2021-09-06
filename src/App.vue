<template>
  <router-view />
  <!-- <Login v-if="!authenticated" /> -->
  <!-- <template v-else>
    <Header />
    <div id="bottom">
      <MainNav />
      <main>
        <router-view />
      </main>
    </div>
  </template> -->
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
    flex-grow: 1;
  }
</style>
