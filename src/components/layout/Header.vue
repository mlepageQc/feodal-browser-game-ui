<template>
  <div class="header">
    Bannière ici
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'

export default class Header extends Vue {}
</script>

<style lang="scss">
  .header {
    background: teal;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    border-bottom: 1px solid black;
  }
</style>
