export default function ({ $axios, store }, inject) {
  const movieApi = $axios.create()

  movieApi.setBaseURL('https://api.themoviedb.org/3')

  movieApi.onRequest(config => {
    config.params = config.params || {}
    config.params.api_key = process.env.MOVIE_API_KEY
    return config
  })

  inject('movieApi', movieApi)
}