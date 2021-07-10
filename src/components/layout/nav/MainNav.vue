<template>
  <Nav>
    <NavItem 
      tooltip="asdfasdfasdf"
      :to="{ name: 'map' }" />
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
  .main-nav {
		min-width: 60px;
    display: flex;
		flex-direction: column;
		border-right: 1px solid black;
    padding: 24px 0;
    align-items: center;

    svg {
      width: 32px;
      height: 32px;
    }

    > :not(:last-child) {
      margin-bottom: 24px;
    }
  }
</style>
