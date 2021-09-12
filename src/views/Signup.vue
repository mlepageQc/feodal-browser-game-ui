<template>
  <div class="signup">
		<div>
			<label for="userName">Email</label>
			<input v-model="userName" name="userName" />
		</div>

		<div>
			<label for="email">Email</label>
			<input v-model="email" name="email" />
		</div>

		<div>
			<label for="password">Password</label>
			<input v-model="password" type="password" name="password" />
		</div>

		<div>
			<label for="passwordConfirmation">Password confirmation</label>
			<input v-model="passwordConfirmation" type="password" name="passwordConfirmation" />
		</div>
		
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
			display: flex;
			flex-direction: column;
			margin-bottom: 10px;
		}
	}
</style>
