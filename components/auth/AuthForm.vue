<template>
  <client-only>
    <v-form
      ref="form"
      v-model="form.valid"
      lazy-validation
      class="mb-4"
      @submit.prevent="validate"
    >
      <v-text-field
        v-if="variant == 'email' || variant == 'email-pass'"
        v-model="form.email"
        label="E-mail"
        :rules="emailRules"
      />
      <v-text-field
        v-if="variant == 'email-pass' || variant == 'pass-pass'"
        v-model="form.password"
        :type="'password'"
        label="Password"
        :counter="20"
        :rules="passwordRules"
      />
      <v-text-field
        v-if="variant == 'pass-pass'"
        v-model="form.passwordCheck"
        :type="'password'"
        label="Password"
        :counter="20"
        :rules="[
          form.password === form.passwordCheck || 'Passwords must match',
          ...passwordRules,
        ]"
      />
      <v-btn
        :disabled="!form.valid"
        :color="btn.color !== undefined ? btn.color : 'primary'"
        class="mr-4"
        type="submit"
        v-text="btn.text"
      />
    </v-form>
  </client-only>
</template>

<script lang="ts">
export default {
  props: {
    variant: {
      type: String,
      default: 'email-pass',
      required: false,
    },
    btn: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        valid: false,
        email: '',
        password: '',
        passwordCheck: '',
      },
      emailRules: [
        (v: string) => !!v || 'E-mail is required',
        (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [
        (v: string) => !!v || 'Password is required',
        (v: string) =>
          (v && v.length <= 20) || 'Password must be less than 20 characters',
      ],
    }
  },
  methods: {
    validate() {
      const form: any = this.$refs.form
      if (form?.validate()) {
        this.$emit('submit', this.form)
      } else {
        this.$error('Form is not valid!')
      }
    },
  },
}
</script>
