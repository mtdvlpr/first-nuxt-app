export default function ({ store }, inject: (arg0: string, arg1: any) => void) {
  inject(
    'flash',
    (message: string, color: string = null, exec: Function = null) => {
      store.dispatch('flash/show', {
        message,
        color,
        exec,
      })
    }
  )

  inject('success', (message: string, exec: Function = null) => {
    store.dispatch('flash/show', {
      message,
      color: 'success',
      exec,
    })
  })

  inject('warn', (message: string, exec: Function = null) => {
    store.dispatch('flash/show', {
      message,
      color: 'warning',
      exec,
    })
  })

  inject('error', (message: string) => {
    store.dispatch('flash/show', {
      message,
      color: 'error',
    })
  })
}
