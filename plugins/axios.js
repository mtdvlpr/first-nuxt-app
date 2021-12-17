export default function ({ $axios, $config }, inject) {
  const movieApi = $axios.create()
  const oneSignalApi = $axios.create()

  movieApi.setBaseURL('https://api.themoviedb.org/3')
  oneSignalApi.setBaseURL('/')

  movieApi.onRequest((config) => {
    config.params = config.params || {}
    config.params.api_key = $config.movieApiKey
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
