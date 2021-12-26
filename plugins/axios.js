import { CancelToken } from 'axios'
import isPlainObject from 'lodash.isplainobject'

function createRequestKey(url, params) {
  let requestKey = url
  if (params) {
    requestKey += `:${createStringFromParameters(params)}`
  }
  return requestKey
}

function createStringFromParameters(obj) {
  const keysArr = []
  for (const key in obj) {
    keysArr.push(key)
    if (isPlainObject(obj[key])) {
      keysArr.push(createStringFromParameters(obj[key]))
    }
  }
  return keysArr.join('|')
}

function createCancelMessage(requestKey, paramsStr) {
  return {
    statusCode: 100,
    requestKey,
    message: `Request canceled: ${requestKey}`,
    paramsStr,
  }
}

export default function ({ $axios, $config, app }, inject) {
  $axios.activeRequests = {}

  $axios.onRequest((config) => {
    console.warn('current', $axios.activeRequests)
    const requestKey = createRequestKey(
      config.baseURL + config.url,
      config.params
    )

    const paramsStr = JSON.stringify(config.params)
    // If another request with the same requestKey already exists, cancel it
    if (
      $axios.activeRequests[requestKey] &&
      $axios.activeRequests[requestKey].cancelToken
    ) {
      $axios.activeRequests[requestKey].cancelToken.cancel(
        createCancelMessage(requestKey, paramsStr)
      )
    }

    if (!$axios[requestKey]) {
      // If request has not been sent before, create a custom promise
      let reqResolve, reqReject
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
    $axios.activeRequests[requestKey].paramsStr = paramsStr

    // Create a cancel token for current request
    const cancelToken = CancelToken.source()
    $axios.activeRequests[requestKey].cancelToken = cancelToken

    // Add the cancel token to the request
    return {
      ...config,
      cancelToken: cancelToken && cancelToken.token,
    }
  })

  $axios.onError((err) => {
    // Check if error message has a requestKey set in active requests
    if (
      err.message &&
      err.message.requestKey &&
      $axios.activeRequests[err.message.requestKey]
    ) {
      const currentRequest = $axios.activeRequests[err.message.requestKey]
      // Check if error concerns a cancellation
      if (
        err.message &&
        err.message.statusCode === 100 &&
        currentRequest &&
        currentRequest.paramsStr === err.message.paramsStr
      ) {
        // Handle the cancellation error
        console.warn(err.message.message)
        // Return a promise to the active request that overrides the current one
        return $axios.activeRequests[err.message.requestKey].promise
      }
    }
    console.error(err)
    return Promise.reject(err)
  })

  $axios.onResponse((response) => {
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

  app.router.beforeEach((_to, _from, next) => {
    for (const requestKey in $axios.activeRequests) {
      $axios.activeRequests[requestKey].cancelToken.cancel(
        createCancelMessage(requestKey)
      )
      delete $axios.activeRequests[requestKey]
    }
    next()
  })

  const movieApi = $axios.create()
  const oneSignalApi = $axios.create()

  movieApi.setBaseURL('https://api.themoviedb.org/3/')
  oneSignalApi.setBaseURL('/')

  movieApi.onRequest((config) => {
    config.params = config.params || {}
    config.params.api_key = config.params.api_key ?? $config.movieApiKey
    return config
  })

  oneSignalApi.onRequest((config) => {
    config.headers = config.headers.common || {}
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
