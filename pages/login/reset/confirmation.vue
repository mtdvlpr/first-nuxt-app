<template>
  <div class="mt-12">
    <v-container>
      <v-row justify="center" class="mt-12">
        <h3>Change your password</h3>
      </v-row>
      <v-row justify="center" class="mt-12">
        <auth-form
          variant="pass-pass"
          :btn="{ text: 'Change password' }"
          @submit="changePassword"
        />
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  auth: 'guest',
  middleware: 'auth',
  data() {
    return {
      token: '',
    }
  },
  head() {
    return { title: 'Change password' }
  },
  mounted() {
    this.token = this.$route.query.token
  },
  methods: {
    async changePassword(form) {
      const token = this.token
      try {
        const verification = await this.$axios.post('/auth/password/change', {
          token,
          password: form.password,
        })
        this.$flash(verification.data.message)
        this.$router.push('/login')
      } catch (err) {
        console.warn(err.response.data.payload)
        this.$error(err.response.data.message)
      }
    },
  },
}
</script>
