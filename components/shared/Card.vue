<template>
  <v-card class="pa-2 mb-4">
    <v-card-title v-if="title" class="justify-center" v-text="title" />
    <v-card-subtitle v-if="subtitle" v-text="subtitle" />
    <v-card-text>
      <slot />
    </v-card-text>
    <v-card-actions>
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: null,
      required: false,
    },
    subtitle: {
      type: String,
      default: null,
      required: false,
    },
  },
}
</script>