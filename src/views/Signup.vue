<template>
  <div class="signup">
		<div>
			<label for="userName">Username (6 char minimum)</label>
			<input id="userName" v-model="userName" />
		</div>

		<div>
			<label for="email">Email</label>
			<input id="email" v-model="email" />
		</div>

		<div>
			<label for="password">Password</label>
			<input id="password" v-model="password" type="password" />
		</div>

		<div>
			<label for="passwordConfirmation">Password confirmation</label>
			<input id="passwordConfirmation" v-model="passwordConfirmation" type="password" />
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
