<template>
  <v-row justify="center" align="start">
    <template v-if="variant == 'main'">
      <v-col cols="12">
        <slot name="main" />
      </v-col>
    </template>
    <template v-else-if="variant == 'aside-main'">
      <v-col cols="12" md="3" class="hidden-sm-and-down">
        <slot name="aside" />
      </v-col>
      <v-col cols="12" md="9">
        <slot name="main" />
      </v-col>
    </template>
    <template v-else>
      <v-col cols="12" md="9">
        <slot name="main" />
      </v-col>
      <v-col cols="12" md="3" class="hidden-sm-and-down">
        <slot name="aside" />
      </v-col>
    </template>
  </v-row>
</template>
<script lang="ts">
export default {
  props: {
    variant: {
      type: String,
      default: 'main-aside',
      required: false,
    },
  },
}
</script>
