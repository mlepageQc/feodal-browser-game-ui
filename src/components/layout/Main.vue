<template>
  <main class="content">
		<Map class="content--map" />
		<Info class="content--info" />
  </main>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Map from './Map.vue'
import Info from './Info.vue'

@Options({
	components: { Map, Info }
})
export default class Main extends Vue {
	display_map: boolean = false
}
</script>

<style lang="scss">
  .content {
		display: flex;
		&--map {
			flex: 5;
		}
		&--info {
			flex: 2;
		}
  }
</style>
