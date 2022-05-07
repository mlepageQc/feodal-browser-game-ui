import { Module } from 'vuex'
import { State } from '@/store'
import User from '@/types/User'
import { fetchCurrentUser } from '@/api/UserApi'

export interface SessionState {
	currentUser: null | User,
	actionCableSocket: null | WebSocket
}

const session: Module<SessionState, State> = {
	namespaced: true, 
	state: {
		currentUser: null,
		actionCableSocket: null
	},
	mutations: {
		setCurrentUser (state, currentUser): void {
			state.currentUser = currentUser
		},
		setActionCableSocket (state, actionCableSocket) {
			state.actionCableSocket = actionCableSocket
		}
	},
	actions: {
		async initialize ({ commit }): Promise<void> {
			const currentUser = (await fetchCurrentUser()).data
			commit('setCurrentUser', currentUser)
		},
		destroy ({ commit }): void {
			commit('setCurrentUser', null)
		}
	},
	getters: {
		isCurrentUser: (state: SessionState) => (userId: string) => {
			return state.currentUser!.id === userId
		}
	}
}

export default session
