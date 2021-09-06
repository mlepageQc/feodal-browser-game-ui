<template>
  <div class="tile">
    <div class="tile--nav">
      {{ x }}, {{ y }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	props: {
		x: {
			type: String as () => string,
			required: true
		},
		y: {
			type: String as () => string,
			required: true
		}
	}
})
</script>

<style lang="scss">
  .tile {
    border-left: 1px solid black;
    background: #EBEBEB;
    min-width: 336px;
    &--nav {
      display: flex;
      align-items: center;
      padding: 0 16px;
      height: 56px;
      border-bottom: 1px solid black;
    }
  }
</style>