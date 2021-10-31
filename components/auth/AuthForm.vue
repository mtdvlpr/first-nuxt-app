<template>
  <client-only>
    <v-form
      ref="form"
      v-model="form.valid"
      lazy-validation
      @submit.prevent="validate"
    >
      <v-text-field
        v-if="variant == 'email' || variant == 'email-pass'"
        v-model="form.email"
        label="E-mail"
        :rules="emailRules"
        required
      />
      <v-text-field
        v-if="variant == 'email-pass' || variant == 'pass-pass'"
        v-model="form.password"
        :type="'password'"
        label="Password"
        :counter="20"
        :rules="passwordRules"
        required
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
        required
      />
      <v-btn
        :disabled="!form.valid"
        color="primary"
        class="mr-4"
        type="submit"
        v-text="btnText"
      />
    </v-form>
  </client-only>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: 'email-pass',
      required: false,
    },
    btnText: {
      type: String,
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
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) =>
          (v && v.length <= 20) || 'Password must be less than 20 characters',
      ],
    }
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.$emit('submit', this.form)
      } else {
        this.$error('Form is not valid!')
      }
    },
  },
}
</script>