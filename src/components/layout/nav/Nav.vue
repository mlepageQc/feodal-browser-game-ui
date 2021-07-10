<template>
	<nav class="nav">
		<ul>
			<slot />
		</ul>
	</nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style lang="scss">
	.nav {
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
