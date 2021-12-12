<template>
	<router-link
		tag="li" 
		class="nav-item"
		:to="to">
		<slot />
	</router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouteLocation } from 'vue-router'
import { TranslateResult } from 'vue-i18n'

export default defineComponent({
	props: {
		to: {
			type: Object as () => RouteLocation,
			required: true
		},
		tooltip: {
			type: String as () => string | TranslateResult,
			required: true
		}
	}
})
</script>

<style lang="scss">
	.nav-item {
		height: 60px;
		width: 100%;
		display: flex;
	}
</style>
