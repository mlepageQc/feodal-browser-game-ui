<template>
  <div class="login">
		<router-link :to="{ name: 'signup' }">No account? Sign up now</router-link>
		<input v-model="userName" />
		<input v-model="password" type="password" />

		<button type="submit" @click="createSession">Login</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions } from 'vuex'
import { login } from '@/api/SessionApi'

export default defineComponent({
	name: 'login',
	data () {
		return {
			userName: '',
			password: ''
		}
	},
	methods: {
		...mapActions('session', [
			'initialize'
		]),
		async createSession () {
			const { jwt } = (await login(this.userName, this.password)).data
			localStorage.setItem('jwt', jwt)
			await this.initialize()
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
