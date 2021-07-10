<template>
  <div class="tile">
    <div class="tile--nav">
      Accès sur différentes informations de la tuile (icones), ce menu n'est qu'une idée
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style lang="scss">
  .tile {
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
