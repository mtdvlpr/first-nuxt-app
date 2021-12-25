// eslint-disable-next-line import/named
import { AxiosOptions, NuxtAxiosInstance } from '@nuxtjs/axios'
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
    $movieApi: NuxtAxiosInstance
    $flash(message: string, color?: string | null, exec?: Function | null): void
    $warn(message: string): void
    $error(message: string): void
    $formatDate(format: string, date: Date | string): string
  }
}

declare module '*.vue' {
  export default Vue
}

declare module '@nuxt/types' {
  interface Context {
    $movieApi: NuxtAxiosInstance
  }

  interface NuxtAppOptions {
    $movieApi: NuxtAxiosInstance
  }

  interface Configuration {
    movieApi?: AxiosOptions
  }
}
