<template>
  <div class="mt-12">
    <v-container class="text-center">
      <v-row class="mt-12 text-center" justify="center">
        <h2>Verification token resending</h2>
      </v-row>
      <v-row :align="'center'" :justify="'center'" class="mt-12">
        <v-col cols="12" md="6" lg="3">
          <auth-form
            variant="email"
            btn-text="Resend verification token"
            @submit="resendToken"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  auth: 'guest',
  middleware: 'auth',
  methods: {
    async resendToken(form) {
      const resendVerification = await this.$axios.post(
        '/auth/confirmation/resend',
        {
          email: form.email,
        }
      )
      this.$flash(resendVerification.data)
    },
  },
}
</script>