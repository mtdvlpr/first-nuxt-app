<template>
  <v-dialog
    v-model="dialog"
    scrollable
    width="100%"
    :max-width="maxWidth"
    overlay-opacity="0.8"
    @click:outside="close()"
  >
    <v-card color="card">
      <template v-if="title">
        <v-card-title v-html="title" />
        <v-divider />
      </template>
      <loading v-if="pending" :message="message" />
      <component :is="component" v-else :props="props" :form="form" />
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      dialog: false,
      data: {},
      persistent: false,
    }
  },
  computed: {
    ...mapGetters('modal', [
      'active',
      'title',
      'component',
      'props',
      'form',
      'maxWidth',
      'pending',
      'message',
      'execOnClose',
    ]),
  },
  watch: {
    active() {
      this.dialog = this.active
    },
    dialog() {
      if (this.dialog === false) this.$store.commit('modal/close')
    },
  },
  methods: {
    close() {
      if (this.execOnClose) this.execOnClose()
      this.$store.commit('modal/close')
    },
  },
}
</script>
