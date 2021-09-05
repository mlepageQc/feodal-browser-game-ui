<template>
  <div class="login">
		<router-link :to="{ name: 'signup' }">No account? Sign up now</router-link>
		<input v-model="userName" />
		<input v-model="password" />

		<button type="submit" @click="createSession">Login</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { login } from '@/api/SessionApi'

export default defineComponent({
	name: 'login',
	data () {
		return {
			userName: 'usertest',
			password: 'fritepizza'
		}
	},
	methods: {
		async createSession () {
			await login(this.userName, this.password)
			this.$router.push({ name: 'map' })
		}
	}
})
</script>

<style lang="scss">
	.login {
		display: flex;
		flex-direction: column;
		width: 50%;
		
		> * {
			margin-bottom: 10px;
		}
	}
</style>
