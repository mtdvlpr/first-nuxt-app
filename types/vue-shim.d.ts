import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $constants: Object
    $auth: {
      loggedIn: boolean
      user: { id: string; email: string; scope: string[] }
      loginWith(strategy: string, payload: Object): any
      logout(): void
    }
    $movieApi: {
      get(url: string): Object
      post(url: string, payload: Object): Object
      put(url: string, payload: Object): Object
      delete(url: string): Object
    }
    $flash(message: string, color?: string | null, exec?: Function | null): void
    $warn(message: string): void
    $error(message: string): void
    $formatDate(format: string, date: Date | string): string
  }
}

declare module '*.vue' {
  export default Vue
}

/* declare module '@nuxt/types' {
  interface Context {
    $axios: NuxtAxiosInstance
  }

  interface NuxtAppOptions {
    $axios: NuxtAxiosInstance
  }

  interface Configuration {
    axios?: AxiosOptions
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $axios: NuxtAxiosInstance
  }
} */
