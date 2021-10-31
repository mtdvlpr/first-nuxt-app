export default function ({ store }, inject) {
  inject('flash', (message, color = null, exec = null) => {
    store.dispatch('flash/show', {
      message,
      color,
      exec
    })
  })

  inject('success', (message) => {
    store.dispatch('flash/show', {
      message,
      color: 'success'
    })
  })

  inject('warn', (message) => {
    store.dispatch('flash/show', {
      message,
      color: 'warning'
    })
  })

  inject('error', (message) => {
    store.dispatch('flash/show', {
      message,
      color: 'error'
    })
  })
}