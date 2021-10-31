<template>
  <v-row justify="center" align="start">
    <v-col cols="12" md="9">
      <card> .col-12 .col-sm-6 .col-md-8 </card>
      <card> .col-12 .col-sm-6 .col-md-8 </card>
      <v-row dense>
        <v-col cols="6">
          <card> .col-6 .col-md-4 </card>
        </v-col>
        <v-col cols="6">
          <card> .col-6 .col-md-4 </card>
        </v-col>
        <v-col cols="6">
          <card> .col-6 .col-md-4 </card>
        </v-col>
        <v-col cols="6">
          <card> .col-6 .col-md-4 </card>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="3" class="hidden-sm-and-down">
      <card> .col-6 .col-md-4 </card>
      <card> .col-6 .col-md-4 </card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  head() {
    return { title: 'Movie #' + this.$route.params.id }
  },
}
</script>
