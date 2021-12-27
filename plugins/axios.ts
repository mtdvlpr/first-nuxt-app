import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import isPlainObject from 'lodash.isplainobject'

const useAbortController = false

// eslint-disable-next-line import/no-named-as-default-member
const CancelToken = axios.CancelToken

function createRequestKey(url: string, params: Object) {
  let requestKey = url
  if (params) {
    requestKey += `:${createStringFromParameters(params)}`
  }
  return requestKey
}

function createStringFromParameters(obj: Object) {
  const keysArr = []
  for (const key in obj) {
    keysArr.push(key)
    if (isPlainObject(obj[key])) {
      keysArr.push(createStringFromParameters(obj[key]))
    }
  }
  return keysArr.join('|')
}

function createCancelMessage(requestKey: string, paramsStr: string = '') {
  if (useAbortController) return new Error(requestKey)
  return {
    statusCode: 100,
    requestKey,
    message: `Request canceled: ${requestKey}`,
    paramsStr,
  }
}

export default function (
  { $config, $axios, app },
  inject: (arg0: string, arg1: any) => void
) {
  $axios.activeRequests = {}

  $axios.onRequest((config: AxiosRequestConfig) => {
    const requestKey = createRequestKey(
      config.baseURL + config.url,
      config.params
    )

    const paramsStr = JSON.stringify(config.params)
    // If another request with the same requestKey already exists, cancel it
    if ($axios.activeRequests[requestKey]) {
      if (useAbortController) {
        $axios.activeRequests[requestKey].controller.abort(
          createCancelMessage(requestKey, paramsStr)
        )
      } else {
        $axios.activeRequests[requestKey].cancelToken.cancel(
          createCancelMessage(requestKey, paramsStr)
        )
      }
    }

    if (!$axios.activeRequests[requestKey]) {
      // If request has not been sent before, create a custom promise
      let reqResolve: (value: unknown) => void,
        reqReject: (reason?: any) => void
      const promise = new Promise((resolve, reject) => {
        reqResolve = resolve
        reqReject = reject
      })

      // Insert current request to activeRequests
      $axios.activeRequests[requestKey] = {
        promise,
        resolve: reqResolve,
        reject: reqReject,
      }
    }

    // Update the active request's params
    $axios.activeRequests[requestKey].paramsStr = paramsStr ?? ''

    // Create a cancel token for current request
    const cancelToken = CancelToken.source()
    const controller = new AbortController()
    $axios.activeRequests[requestKey].cancelToken = cancelToken
    $axios.activeRequests[requestKey].controller = controller

    // Add the cancel token to the request
    return {
      ...config,
      cancelToken: cancelToken && cancelToken.token,
      signal: controller.signal,
    }
  })

  $axios.onError((err: any) => {
    // Check if error message has a requestKey set in active requests
    if (
      err.message &&
      err.message.requestKey &&
      $axios.activeRequests[err.message.requestKey]
    ) {
      const currentRequest = $axios.activeRequests[err.message.requestKey]
      // Check if error concerns a cancellation
      if (
        err.message.statusCode === 100 &&
        currentRequest &&
        currentRequest.paramsStr === err.message.paramsStr
      ) {
        // Handle the cancellation error
        console.warn(err.message.message)
        // Return a promise to the active request that overrides the current one
        return $axios.activeRequests[err.message.requestKey].promise
      }
    } else {
      const currentRequest = $axios.activeRequests[err.message]
      // Check if error concerns a cancellation
      if (err.message && currentRequest) {
        // Handle the cancellation error
        console.warn('Canceled: ' + err.message)
        // Return a promise to the active request that overrides the current one
        return $axios.activeRequests[err.message].promise
      }
    }
    console.error(err)
    return Promise.reject(err)
  })

  $axios.onResponse((response: AxiosResponse) => {
    // Check if user has set a custom requestKey
    const requestKey = createRequestKey(
      response.config.url,
      response.config.params
    )
    if ($axios.activeRequests[requestKey]) {
      // Inform all previously cancelled requests with the current response & remove requestKey from activeRequests
      $axios.activeRequests[requestKey].resolve(response)
      delete $axios.activeRequests[requestKey]
    }
  })

  app.router.beforeEach((_to, _from, next: Function) => {
    for (const requestKey in $axios.activeRequests) {
      if (useAbortController) {
        $axios.activeRequests[requestKey].controller.abort(
          createCancelMessage(requestKey)
        )
      } else {
        $axios.activeRequests[requestKey].cancelToken.cancel(
          createCancelMessage(requestKey)
        )
      }
      delete $axios.activeRequests[requestKey]
    }
    next()
  })

  const movieApi = $axios.create()
  const oneSignalApi = $axios.create()

  movieApi.setBaseURL('https://api.themoviedb.org/3/')
  oneSignalApi.setBaseURL('/')

  movieApi.onRequest((config: AxiosRequestConfig) => {
    config.params = config.params || {}
    config.params.api_key = config.params.api_key ?? $config.movieApiKey
    return config
  })

  oneSignalApi.onRequest((config: AxiosRequestConfig) => {
    config.headers = config.headers || {}
    config.headers.Authorization = 'Basic ' + $config.oneSignalApiKey
    config.data = config.data || {}
    config.data.app_id = $config.oneSignalAppId
    config.data.tags = [
      { key: 'id', relation: '=', value: config.data.identifier },
    ]
    return config
  })

  inject('movieApi', movieApi)
  inject('oneSignalApi', oneSignalApi)
}
