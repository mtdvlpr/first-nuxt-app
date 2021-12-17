export const state = () => ({
  message: '',
  color: '',
  exec: null,
})

export const mutations = {
  message(state, message) {
    state.message = message
  },

  color(state, color) {
    state.color = color
  },

  exec(state, exec) {
    state.exec = exec
  },
}

export const actions = {
  show({ commit }, payload) {
    commit('message', payload.message)
    commit('color', payload.color ?? 'info')
    commit('exec', payload.exec ?? null)
  },

  clear({ commit }) {
    commit('message', '')
  },
}

export const getters = {
  message(state) {
    return state.message
  },
  color(state) {
    return state.color
  },
  exec(state) {
    return state.exec
  },
}
