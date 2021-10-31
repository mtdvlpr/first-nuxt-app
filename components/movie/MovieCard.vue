<template>
  <v-card nuxt :to="'/movies/' + movie.id" color="card" class="pa-2 mb-2 mx-1">
    <v-card-title class="justify-center" v-text="movie.title" />
    <div class="d-flex flex-no-wrap justify-space-between">
      <ul>
        <li>{{ movie.vote_average }}/10</li>
        <li>{{ getGenres(movie.genres) }}</li>
      </ul>
      <v-img
        contain
        max-width="50%"
        class="ml-auto"
        :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
      />
    </div>
  </v-card>
</template>
<script>
export default {
  props: {
    movie: {
      type: Object,
      required: true,
    },
    variant: {
      type: String,
      default: 'default',
      required: false,
    },
  },
  methods: {
    getGenres(genres) {
      let string = ''
      genres.forEach((genre, i) => {
        if (i !== 0) string += ', '
        string += genre
      })
      return string
    },
  },
}
</script>
