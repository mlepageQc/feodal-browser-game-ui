<template>
  <Nav>
    <NavItem 
      :to="mapRoute">
      <MapIcon />
    </NavItem>
    <NavItem 
      :to="charactersRoute">
      <ShieldIcon />
    </NavItem>
  </Nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MapIcon from '@/assets/svgs/map.svg'
import ShieldIcon from '@/assets/svgs/shield.svg'
import Nav from './Nav.vue'
import NavItem from './NavItem.vue'
import RouteNames from '@/config/RouteNames'

export default defineComponent({
  components: { 
    Nav, 
    NavItem, 
    MapIcon,
    ShieldIcon 
  },
  computed: {
    mapRoute () {
      return { name: RouteNames.Map }
    },
    charactersRoute () {
      return { name: RouteNames.Characters }
    }
  }
})
</script>
