<template>
  <div class="mt-12">
    <v-container>
      <v-row justify="center" class="mt-12 text-center">
        <v-col v-if="confirmationStatus === 'verified'" cols="12">
          <v-btn to="/login" nuxt class="ma-3" color="primary"
            >Go to login page</v-btn
          >
        </v-col>
        <v-col v-else-if="confirmationStatus === 'unverified'" cols="12">
          <v-btn
            to="/register/confirmation/resend"
            nuxt
            class="ma-3"
            color="primary"
            >Resend a verification token</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  auth: 'guest',
  middleware: 'auth',
  data: () => ({
    resend: false,
    confirmationStatus: false,
  }),
  head() {
    return { title: 'Verify email' }
  },
  mounted() {
    this.checkToken()
  },
  methods: {
    async checkToken() {
      const token = this.$route.query.token
      const verification = await this.$axios.post('/auth/confirmation/', {
        token,
      })
      this.confirmationStatus = verification.data.confirmationStatus
      this.$flash(verification.data.message)
    },
  },
}
</script>