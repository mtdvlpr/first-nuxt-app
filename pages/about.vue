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
    </v-col>
  </v-row>
</template>
<script>
export default {
  methods: {
    flash(message, color = null, exec = null) {
      this.$flash(message, color, exec)
    },
    warning(message) {
      this.$warn(message)
    },
    error(message) {
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
  },
}
</script><template>
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
    </v-col>
  </v-row>
</template>
<script>
export default {
  head() {
    return { title: 'About' }
  },
  methods: {
    flash(message, color = null, exec = null) {
      this.$flash(message, color, exec)
    },
    warning(message) {
      this.$warn(message)
    },
    error(message) {
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
  },
}
</script>