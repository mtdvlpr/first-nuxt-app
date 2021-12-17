<template>
  <v-dialog v-model="dialog" scrollable width="100%" :max-width="maxWidth">
    <v-card color="card">
      <v-card-title v-if="title" v-text="title" />
      <v-card-text v-if="message" style="max-width: 600px" v-html="message" />
      <component :is="component" v-if="component" :props="componentProps" />
      <v-card-actions v-if="!component">
        <v-spacer />
        <v-btn color="error" class="mr-4" @click="clear()">Annuleren</v-btn
        ><v-btn color="primary" @click="ok()">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      dialog: false,
    }
  },
  computed: {
    ...mapGetters('confirm', [
      'confirm',
      'exec',
      'message',
      'title',
      'cancel',
      'component',
      'componentProps',
      'maxWidth',
      'to',
      'flash',
    ]),
  },
  watch: {
    confirm: {
      handler() {
        this.dialog = this.message || this.component
      },
      deep: true,
    },
  },
  methods: {
    async clear() {
      if (this.cancel) await this.cancel()
      this.$store.commit('confirm/clear')
    },
    async ok() {
      try {
        await this.exec()
        if (this.to) this.$router.push(this.to)
        if (this.flash) this.$flash(this.flash)
        this.$store.commit('confirm/clear')
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>
