import { Module } from 'vuex'
import { State } from '@/store'
import User from '@/types/User'
import { fetchCurrentUser } from '@/api/UserApi'
import { logout } from '@/api/SessionApi'

interface SessionState {
	currentUser: null | User
}

const session: Module<SessionState, State> = {
	namespaced: true, 
	state: {
		currentUser: null
	},
	mutations: {
		setCurrentUser (state, currentUser): void {
			state.currentUser = currentUser
		}
	},
	actions: {
		async initialize ({ commit }): Promise<void> {
			const currentUser = (await fetchCurrentUser()).data
			commit('setCurrentUser', currentUser)
		},
		async destroy ({ commit }): Promise<void> {
			await logout()
			commit('setCurrentUser', null)
		}
	}
}

export default session
