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
              v-if="pagination.totalResults > pagination.perPage"
              v-model="pagination.page"
              :length="pagination.totalPages"
              :total-visible="11"
              @input="changePage"
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
      pagination: {
        page: parseInt(this.$route.query.page as string) ?? 1,
        perPage: 20,
        totalPages: 1,
        totalResults: 0,
      },
    }
  },
  async fetch() {
    if (process.server) {
      if (!this.pagination.page || this.pagination.page < 1) {
        this.pagination.page = 1
      }
      try {
        const result = await this.$movieApi.$get('/movie/top_rated', {
          params: { page: this.pagination.page, region: 'NL' },
        })
        this.pagination.totalPages = result.total_pages
        this.pagination.totalResults = result.total_results

        const movies = result.results
        const data = await this.$movieApi.$get('/genre/movie/list')
        movies.forEach((movie) => {
          movie.genres = data.genres
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
  computed: {
    page() {
      if (this.$route.query.page) {
        return parseInt(this.$route.query.page as string)
      }
      return null
    },
  },
  watch: {
    page(val) {
      if (!val) {
        this.movies = null
        window.location.href = '/movies?page=1'
      }
    },
  },
  mounted() {
    if (!this.movies) {
      window.location.reload()
    }
  },
  methods: {
    changePage(page) {
      this.movies = null
      window.location.href = `/movies?page=${page}`
    },
  },
}
</script>
