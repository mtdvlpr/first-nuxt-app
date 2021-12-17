<template>
  <div class="mt-12">
    <v-container class="text-center">
      <v-row class="mt-12 text-center" justify="center">
        <h2>Password reset</h2>
      </v-row>
      <v-row :align="'center'" :justify="'center'" class="mt-12">
        <v-col cols="12" md="6" lg="3">
          <auth-form
            variant="email"
            :btn="{ text: 'Reset password', color: 'error' }"
            @submit="sendPasswordToken"
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
  head() {
    return { title: 'Reset password' }
  },
  methods: {
    async sendPasswordToken(form) {
      try {
        const email = form.email
        const response = await this.$axios.post('/auth/password/reset', {
          email,
        })
        this.$flash(response.data.message)
      } catch (err) {
        this.$error(err.response.data.message)
      }
    },
  },
}
</script>
