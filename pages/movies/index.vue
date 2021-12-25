<template>
  <page-layout>
    <template #main>
      <card> .col-12 .col-sm-6 .col-md-8 </card>
      <card> .col-12 .col-sm-6 .col-md-8 </card>
      <v-row dense>
        <template v-if="!movies">
          <v-col v-for="i in pagination.perPage" :key="i" cols="6">
            <v-skeleton-loader type="card" class="pa-2 mb-4" />
          </v-col>
        </template>
        <template v-else>
          <v-col v-for="movie in movies" :key="movie.id" cols="12" sm="6">
            <movie-card :movie="movie" />
          </v-col>
          <v-col>
            <v-pagination
              v-if="pagination.total > pagination.perPage"
              v-model="pagination.page"
              :length="pagination.total"
              :total-visible="10"
            />
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
<script lang="ts">
export default {
  data() {
    return {
      movies: null,
      pagination: { page: 1, perPage: 20, total: 0 },
    }
  },
  async fetch() {
    if (process.server) {
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
      } catch (e) {
        console.error(e)
        this.$error("Movies couldn't be fetched")
      }
    }
  },
  head() {
    return { title: 'Our collection' }
  },
  mounted() {
    if (!this.movies) {
      window.location.reload()
    }
  },
}
</script>
