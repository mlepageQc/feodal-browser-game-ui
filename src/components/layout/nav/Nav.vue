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
		border-right: 1px solid black;
	}
</style>
