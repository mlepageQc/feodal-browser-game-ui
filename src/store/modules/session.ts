import { Module } from 'vuex'
import { State } from '@/store'
import User from '@/types/User'
import { fetchCurrentUser } from '@/api/UserApi'

interface SessionState {
	currentUser: null | User
}

const session: Module<SessionState, State> = {
	namespaced: true, 
	state: {
		currentUser: null
	},
	mutations: {
		setCurrentUser (state, currentUser) {
			state.currentUser = currentUser
		}
	},
	actions: {
		async initialize ({ commit }) {
			const currentUser = (await fetchCurrentUser()).data
			commit('setCurrentUser', currentUser)
		}
	}
}

export default session
