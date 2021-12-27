interface State {
  active: Boolean
  title: string | null
  component: string | null
  props: Object | null
  form: string | null
  maxWidth: string | null
  pending: Boolean
  message: string | null
  execOnClose: Function | null
}

export const state = () => ({
  active: false,
  title: null,
  component: null,
  props: null,
  form: '{}',
  maxWidth: null,
  pending: false,
  message: null,
  execOnClose: null,
})

export const mutations = {
  open(state: State, payload: State) {
    state.title = payload.title ?? ''
    state.component = payload.component ?? null
    state.props = payload.props ?? {}
    state.form = payload.form ?? '{}'
    state.maxWidth = payload.maxWidth ?? '700px'
    state.message = payload.message ?? null
    state.execOnClose = payload.execOnClose ?? null
    state.active = true
  },
  close(state: State) {
    state.active = false
  },
  setPending(state: State, pending: Boolean) {
    state.pending = pending
    if (!pending) state.message = null
  },
  setMessage(state: State, message: string) {
    state.message = message
  },
}

export const getters = {
  active(state: State) {
    return state.active
  },
  title(state: State) {
    return state.title
  },
  component(state: State) {
    return state.component
  },
  props(state: State) {
    return state.props
  },
  form(state: State) {
    return JSON.parse(state.form)
  },
  maxWidth(state: State) {
    return state.maxWidth
  },
  pending(state: State) {
    return state.pending
  },
  message(state: State) {
    return state.message
  },
  execOnClose(state: State) {
    return state.execOnClose
  },
}
