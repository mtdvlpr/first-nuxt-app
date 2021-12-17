export const state = () => ({
  title: null,
  message: null,
  component: null,
  componentProps: null,
  maxWidth: null,
  exec: null,
  cancel: null,
  to: null,
  flash: null,
})

export const mutations = {
  set(state, payload) {
    state.exec = payload.exec
    state.message = payload.message
    state.title = payload.title ?? null
    state.component = payload.component ?? null
    state.componentProps = payload.componentProps ?? null
    state.maxWidth = payload.maxWidth ?? '600px'
    state.cancel = payload.cancel ?? null
    state.to = payload.to ?? null
    state.flash = payload.flash ?? null
  },
  clear(state) {
    Object.keys(state).forEach((key) => (state[key] = null))
  },
}

export const getters = {
  confirm(state) {
    return state
  },
  exec(state) {
    return state.exec
  },
  title(state) {
    return state.title
  },
  message(state) {
    return state.message
  },
  component(state) {
    return state.component
  },
  componentProps(state) {
    return state.componentProps
  },
  maxWidth(state) {
    return state.maxWidth
  },
  cancel(state) {
    return state.cancel
  },
  to(state) {
    return state.to
  },
  flash(state) {
    return state.flash
  },
}
