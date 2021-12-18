<template>
  <div class="messages">
    <v-snackbar
      v-for="(m, key) in messages"
      :key="key"
      top
      absolute
      rounded
      :value="true"
      :timeout="6000"
      :color="m.color"
      :min-width="0"
      :min-height="0"
      content-class="message-content"
      :style="`z-index: 999; top: ${60 * key + 8}px`"
      @click="performExec(m.exec)"
    >
      {{ m.message }}
    </v-snackbar>
  </div>
</template>
<script lang="ts">
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      messages: [],
    }
  },
  computed: {
    ...mapGetters('flash', ['message', 'color', 'exec']),
  },
  watch: {
    message(val: string) {
      if (val) {
        this.messages.push({
          message: val,
          color: this.color,
          exec: this.exec,
          showTime: 6,
        })
        this.$store.dispatch('flash/clear')
      }
    },
  },
  mounted() {
    window.setInterval(() => {
      this.checkMessages()
    }, 1000)
  },
  methods: {
    checkMessages(): void {
      this.messages.forEach(
        (
          message: {
            message: string
            color: string
            exec: Function
            showTime: number
          },
          key: number
        ) => {
          if (message.showTime < 1) {
            this.messages.shift()
          } else {
            this.messages[key].showTime--
          }
        }
      )
    },
    performExec(exec: Function | null): void {
      if (exec) exec()
    },
  },
}
</script>
<style scoped>
.messages >>> .message-content {
  text-align: center !important;
  padding: 10px 20px !important;
}
</style>
