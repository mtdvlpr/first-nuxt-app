<template>
  <v-row>
    <v-col class="text-center">
      <img src="/v.png" alt="Vuetify.js" class="mb-5" />
      <blockquote class="blockquote">
        &#8220;First, solve the problem. Then, write the code.&#8221;
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
        </footer>
      </blockquote>
      <v-btn @click="flash('this is a message')">Show flash</v-btn>
      <v-btn @click="warning('This is a warning.')">Show warning</v-btn>
      <v-btn @click="error('This is an error!')">Show Error</v-btn>
      <v-btn @click="confirm()">Show modal with confirmation</v-btn>
      <v-btn @click="fetch()">Fetch</v-btn>
    </v-col>
  </v-row>
</template>
<script lang="ts">
export default {
  head() {
    return { title: 'Inspire' }
  },
  methods: {
    flash(
      message: string,
      color: string | null = null,
      exec: Function | null = null
    ) {
      this.$flash(message, color, exec)
    },
    warning(message: string) {
      this.$warn(message)
    },
    error(message: string) {
      this.$error(message)
    },
    confirm() {
      this.$store.commit('confirm/set', {
        title: 'Bevestigen',
        message: 'Weet je zeker dat je de modal wilt openen?',
        flash: 'Model geopend',
        exec: () => {
          this.$store.commit('modal/open', {
            title: 'MODAL',
            message: 'LOADING...',
          })
          this.$store.commit('modal/setPending', true)
          setTimeout(() => {
            this.$store.commit('modal/setPending', false)
          }, 5000)
        },
      })
    },
    async fetch() {
      const result = await this.$axios.$get(
        'https://archive.org/metadata/TheAdventuresOfTomSawyer_201303'
      )
      this.$axios.$get('https://api.openbrewerydb.org/breweries')
      console.log(result)
    },
  },
}
</script>
