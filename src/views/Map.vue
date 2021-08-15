<template>
  <div class="map">
    <div class="map--display">
      Ici la carte. Un icon cliquable dans le haut à droite permettra de la 'collapse', ainsi, la section d'information pourra afficher toutes les sections en même temps si l'utilisateur veut avoir une vision plus globale sans la carte.
    </div>
    <router-view class="map--tile" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style lang="scss">
  .map {
    display: flex;
    &--display {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 56px;
      flex: 5;
    }
    &--tile {
      flex: 2; 
    }
  }
</style>
