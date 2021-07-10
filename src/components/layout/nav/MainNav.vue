<template>
  <Nav>
    <NavItem :to="{ name: 'map' }" tooltip="Some tooltip" />
  </Nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Nav from './Nav.vue'
import NavItem from './NavItem.vue'

export default defineComponent({
  components: { Nav, NavItem }
})
</script>

<style lang="scss">
</style>
