interface State {
  message: string
  color: string
  exec: Function | null
}

export const state = () => ({
  message: '',
  color: '',
  exec: null,
})

export const mutations = {
  message(state: State, message: string) {
    state.message = message
  },

  color(state: State, color: string) {
    state.color = color
  },

  exec(state: State, exec: Function | null) {
    state.exec = exec
  },
}

export const actions = {
  show({ commit }, payload: State) {
    commit('message', payload.message)
    commit('color', payload.color ?? 'info')
    commit('exec', payload.exec ?? null)
  },

  clear({ commit }) {
    commit('message', '')
  },
}

export const getters = {
  message(state: State) {
    return state.message
  },
  color(state: State) {
    return state.color
  },
  exec(state: State) {
    return state.exec
  },
}
