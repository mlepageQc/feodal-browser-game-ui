<template>
	<button class="button">
		<slot name="icon-left" />
		<slot />
		<slot name="icon-right" />
	</button>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'

export default class Button extends Vue {}
</script>

<style lang="scss">
	.button {
		border-radius: 2px;
		border: 1px solid black;
		display: flex;
		justify-content: center;
	}
</style>
