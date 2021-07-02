<template>
  <div class="content">
		<Map class="content--map" />
		<Info class="content--info" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Map from './Map.vue'
import Info from './Info.vue'

@Options({
	components: { Map, Info }
})
export default class Nav extends Vue {
	display_map: boolean = false
}
</script>

<style lang="scss">
  .content {
		display: flex;
		&--map {
			flex: 4;
		}
		&--info {
			flex: 1;
		}
  }
</style>
