<template>
  <div class="map">
    Ici la carte. Un icon cliquable dans le haut à droite permettra de la 'collapse', ainsi, la section d'information pourra afficher toutes les sections en même temps si l'utilisateur veut avoir une vision plus globale sans la carte.
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style lang="scss">
  .map {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 56px;
  }
</style>