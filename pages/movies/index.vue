<template>
  <page-layout>
    <template #main>
      <card> .col-12 .col-sm-6 .col-md-8 </card>
      <card> .col-12 .col-sm-6 .col-md-8 </card>
      <v-row dense>
        <template v-if="loading">
          <v-col v-for="i in 20" :key="i" cols="6">
            <v-skeleton-loader type="card" class="pa-2 mb-4" />
          </v-col>
        </template>
        <template v-else>
          <v-col v-for="movie in movies" :key="movie.id" cols="6">
            <movie-card :movie="movie" />
          </v-col>
        </template>
      </v-row>
    </template>
    <template #aside>
      <card> .col-6 .col-md-4 </card>
      <card> .col-6 .col-md-4 </card>
    </template>
  </page-layout>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      movies: [],
      loading: false,
      pagination: { page: 1, perPage: 20, total: 0 },
    }
  },
  head() {
    return { title: 'Our collection' }
  },
  computed: {},
  mounted() {
    this.getMovies()
  },
  methods: {
    async getMovies() {
      this.loading = true
      try {
        const result = await this.$movieApi.get('/movie/top_rated', {
          params: { page: this.pagination.page, region: 'NL' },
        })
        this.pagination.total = result.data.total_results

        const movies = result.data.results
        const genres = await this.$movieApi.get('/genre/movie/list')
        movies.forEach((movie) => {
          movie.genres = genres.data.genres
            .filter((g) => movie.genre_ids.includes(g.id))
            .map((g) => g.name)
        })
        this.movies = movies
        console.log(result.data.results)
      } catch (e) {
        console.error(e)
        this.$error("Movies couldn't be fetched")
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
