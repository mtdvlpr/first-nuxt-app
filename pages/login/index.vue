<template>
  <v-container class="text-center">
    <v-row :align="'center'" :justify="'center'" class="mt-12">
      <v-col cols="12" md="6" lg="3">
        <auth-form :btn="{ text: 'Log in' }" @submit="login" />
        <p>
          Don't have an acocunt yet?
          <nuxt-link exact to="/register">Register</nuxt-link>
        </p>
        <p>
          Forgot you password?
          <nuxt-link exact to="/login/reset">Reset password</nuxt-link>
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  auth: 'guest',
  middleware: 'auth',
  head() {
    return { title: 'Log in' }
  },
  methods: {
    async login(form) {
      try {
        const response = await this.$auth.loginWith('local', {
          data: {
            email: form.email,
            password: form.password,
          },
        })
        this.$flash(response.data.message)
      } catch (e) {
        console.error(e.response)
        this.$error(e.response.data.message)
      }
    },
  },
}
</script>
