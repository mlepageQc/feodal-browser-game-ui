<template>
  <div class="signup">
		<input v-model="userName" />
		<input v-model="email" />
		<input v-model="password" />
		<input v-model="passwordConfirmation" />

		<button type="submit" @click="createUser">Create user</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { createUser } from '@/api/UserApi'

export default defineComponent({
	name: 'signup',
	data () {
		return {
			userName: '',
			email: '',
			password: '',
			passwordConfirmation: ''
		}
	},
	methods: {
		createUser (): void {
			createUser(
				this.userName,
				this.email,
				this.password,
				this.passwordConfirmation
			).then(() => {
				this.$router.push({ name: 'login' })
			})
		}
	}
})
</script>

<style lang="scss">
	.signup {
		display: flex;
		flex-direction: column;
		width: 50%;
		
		> * {
			margin-bottom: 10px;
		}
	}
</style>
