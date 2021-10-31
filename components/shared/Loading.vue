<template>
  <div class="text-center my-10">
    <v-progress-circular indeterminate />
    <div v-if="message" class="text-center mt-2">
      <h4 class="white--text">{{ message }}</h4>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    message: {
      type: String,
      default: null,
      required: false,
    },
  },
}
</script>