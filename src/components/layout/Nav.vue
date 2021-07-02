<template>
  <div class="nav">
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'

export default class Nav extends Vue {}
</script>

<style>
  .nav {
		width: 60px;
    display: flex;
		flex-direction: column;
		border-right: 1px solid black;
  }
</style>
