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
  open(state, payload) {
    state.title = payload.title ?? ''
    state.component = payload.component ?? null
    state.props = payload.props ?? {}
    state.form = payload.form ?? '{}'
    state.maxWidth = payload.maxWidth ?? '700px'
    state.message = payload.message ?? null
    state.execOnClose = payload.execOnClose ?? null
    state.active = true
  },
  close(state) {
    state.active = false
  },
  setPending(state, pending) {
    state.pending = pending
    if (!pending) state.message = null
  },
  setMessage(state, message) {
    state.message = message
  },
}

export const getters = {
  active(state) {
    return state.active
  },
  title(state) {
    return state.title
  },
  component(state) {
    return state.component
  },
  props(state) {
    return state.props
  },
  form(state) {
    return JSON.parse(state.form)
  },
  maxWidth(state) {
    return state.maxWidth
  },
  pending(state) {
    return state.pending
  },
  message(state) {
    return state.message
  },
  execOnClose(state) {
    return state.execOnClose
  },
}
