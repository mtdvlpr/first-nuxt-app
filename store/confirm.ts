interface State {
  title: string | null
  message: string | null
  component: string | null
  componentProps: string | null
  maxWidth: string | null
  exec: Function | null
  cancel: Function | null
  to: string | null
  flash: string | null
}

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
  set(state: State, payload: State) {
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
  clear(state: State) {
    Object.keys(state).forEach((key) => (state[key] = null))
  },
}

export const getters = {
  confirm(state: State) {
    return state
  },
  exec(state: State) {
    return state.exec
  },
  title(state: State) {
    return state.title
  },
  message(state: State) {
    return state.message
  },
  component(state: State) {
    return state.component
  },
  componentProps(state: State) {
    return state.componentProps
  },
  maxWidth(state: State) {
    return state.maxWidth
  },
  cancel(state: State) {
    return state.cancel
  },
  to(state: State) {
    return state.to
  },
  flash(state: State) {
    return state.flash
  },
}
