<template>
	<router-view 
		tag="li" 
		class="nav-item"
		:to="to">
		<slot />
	</router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouteLocationNormalized } from 'vue-router'
import { TranslateResult } from 'vue-i18n'

export default defineComponent({
	props: {
		to: {
			type: Object as () => RouteLocationNormalized,
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
		&:not(:last-child) {
			margin-bottom: 24px;
		}
	}
</style>
