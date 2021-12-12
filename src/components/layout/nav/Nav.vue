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
		flex: 0 0 60px;
    display: flex;
		flex-direction: column;
		border-right: 1px solid black;
    padding: 12px 0;
    align-items: center;
		box-sizing: border-box;

		ul {
			width: 100%;
		}

    > :not(:last-child) {
      margin-bottom: 24px;
    }
	}
</style>
