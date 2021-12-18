<template>
  <page-layout>
    <template #main>
      <v-skeleton-loader v-if="loading" type="card" class="pa-2 mb-4" />
      <movie-card v-else :movie="movie" variant="big" />
    </template>
    <template #aside>
      <card> .col-6 .col-md-4 </card>
      <card> .col-6 .col-md-4 </card>
    </template>
  </page-layout>
</template>
<script lang="ts">
export default {
  data(): Object {
    return {
      loading: true,
      movie: null,
    }
  },
  head(): Object {
    return { title: 'Movie #' + this.$route.params.id }
  },
  computed: {
    movieId(): number | undefined {
      return this.$route.params.id
    },
  },
  mounted() {
    this.getMovie()
  },
  methods: {
    async getMovie(): Promise<void> {
      this.loading = true
      try {
        const result = await this.$movieApi.get(`/movie/${this.movieId}`)
        const movie = result.data
        movie.genres = movie.genres.map(
          (g: { id: number; name: string }) => g.name
        )
        this.movie = movie
      } catch (e) {
        console.error(e)
        this.$error("Movie couldn't be fetched")
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
