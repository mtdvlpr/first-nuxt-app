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
      content-class="message__content"
      :style="`z-index: 999; top: ${60 * key + 8}px`"
      @click="performExec(m.exec)"
    >
      {{ m.message }}
    </v-snackbar>
  </div>
</template>
<script>
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
    message(val) {
      if (val) {
        this.messages.push({
          message: val,
          color: this.color,
          exec: this.exec,
          showTime: 6,
        })
      }
    },
  },
  mounted() {
    window.setInterval(() => {
      this.checkMessages()
    }, 1000)
  },
  methods: {
    checkMessages() {
      this.messages.forEach((message, key) => {
        if (message.showTime < 1) {
          this.messages.shift()
        } else {
          this.messages[key].showTime--
        }
      })
    },
    performExec(exec) {
      if (exec) exec()
    },
  },
}
</script>
<style scoped>
.messages >>> .message__content {
  text-align: center !important;
  padding: 10px 20px !important;
}
</style>