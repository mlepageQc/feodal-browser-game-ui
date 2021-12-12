<template>
  <Nav>
    <NavItem 
      :to="{ name: 'map' }" 
      tooltip="Some tooltip">
      <MapIcon />
    </NavItem>
    <NavItem 
      :to="{ name: 'map' }" 
      tooltip="Some tooltip">
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

export default defineComponent({
  components: { 
    Nav, 
    NavItem, 
    MapIcon,
    ShieldIcon 
  }
})
</script>
