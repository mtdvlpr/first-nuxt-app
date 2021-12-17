<template>
  <v-container class="text-center">
    <v-row :align="'center'" :justify="'center'" class="mt-12">
      <v-col cols="12" md="6" lg="3">
        <auth-form
          :btn="{ text: 'Register', color: 'success' }"
          @submit="register"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  auth: 'guest',
  middleware: 'auth',
  head() {
    return { title: 'Register' }
  },
  methods: {
    async register(form) {
      try {
        const result = await this.$axios.post('/auth/register', {
          email: form.email,
          password: form.password,
        })

        this.$flash(result.data.message)
      } catch (e) {
        console.error(e.response.data.error)
        this.$error(e.response.data.message)
      }
    },
  },
}
</script>
