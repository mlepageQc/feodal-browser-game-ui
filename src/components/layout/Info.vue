<template>
  <div class="info">
    <div class="info--nav">
      Accès sur différentes informations de la tuile (icones), ce menu n'est qu'une idée
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'

export default class Info extends Vue {}
</script>

<style lang="scss">
  .info {
    border-left: 1px solid black;
    background: #EBEBEB;
    &--nav {
      display: flex;
      align-items: center;
      padding: 0 16px;
      height: 56px;
      border-bottom: 1px solid black;
    }
  }
</style>
