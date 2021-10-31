export const state = () => ({
  message: '',
  color: '',
  baseColor: 'info',
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
  }
}

export const actions = {
  show({ state, commit }, payload) {
    commit('message', payload.message)
    commit('color', payload.color ?? state.baseColor)
    commit('exec', payload.exec ?? null)
  },

  clear({ commit }) {
    commit('message', '')
    commit('color', '')
  }
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
  }
}