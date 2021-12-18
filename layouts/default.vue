<template>
  <v-app dark>
    <flash />
    <modal />
    <confirm />
    <v-navigation-drawer
      v-model="drawer"
      class="hidden-md-and-up"
      disable-resize-watcher
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          nuxt
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app>
      <v-app-bar-nav-icon
        class="hidden-md-and-up"
        @click.stop="drawer = !drawer"
      />
      <nuxt-link exact aria-label="Go to home" to="/">
        <v-img
          class="mx-2"
          :src="$icon(64)"
          max-height="40"
          max-width="40"
          contain
          alt="Website Logo"
        />
      </nuxt-link>
      <v-toolbar-title @click="$router.push('/')">
        Movies For You
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn v-for="item in items" :key="item.title" :to="item.to" nuxt exact>
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
      <v-spacer />
      <v-toolbar-items class="hidden-xs-only">
        <v-btn icon aria-label="Toggle dark mode" @click="toggleDarkMode">
          <v-icon>mdi-brightness-6</v-icon>
        </v-btn>
        <v-btn
          icon
          aria-label="Enable notifications"
          @click="enableNotifications"
        >
          <v-icon>mdi-bell</v-icon>
        </v-btn>
        <template v-if="loggedIn">
          <v-btn to="/profile" nuxt exact>
            <v-icon left>mdi-account</v-icon>
            Your account
          </v-btn>
          <v-btn @click="logout()">
            <v-icon left>mdi-logout</v-icon>
            Log out
          </v-btn>
        </template>
        <v-btn v-else to="/login" nuxt exact>
          <v-icon left>mdi-account</v-icon>
          Log in
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :color="footerColor" absolute padless app>
      <v-row justify="center" no-gutters>
        <v-btn color="white" text rounded class="my-2" to="/">
          <v-icon left>mdi-home</v-icon>
          home
        </v-btn>
        <v-btn
          v-for="(link, i) in items"
          :key="i"
          color="white"
          text
          rounded
          class="my-2"
          :to="link.to"
          exact
          nuxt
        >
          <v-icon left>{{ link.icon }}</v-icon>
          {{ link.title }}
        </v-btn>
        <v-col class="py-4 text-center white--text" cols="12">
          &copy; {{ new Date().getFullYear() }} —
          <strong>Movies For You</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>
<script lang="ts">
export default {
  data() {
    return {
      drawer: false,
      notify: false,
      items: [
        {
          icon: 'mdi-information-outline',
          title: 'About us',
          to: '/about',
        },
        {
          icon: 'mdi-email',
          title: 'Contact us',
          to: '/contact',
        },
        {
          icon: 'mdi-movie',
          title: 'Our collection',
          to: '/movies',
        },
      ],
    }
  },
  computed: {
    loggedIn(): boolean {
      return this.$auth.loggedIn
    },
    footerColor(): string {
      return this.$vuetify.theme.dark ? '' : 'black'
    },
  },
  watch: {
    loggedIn() {
      this.$OneSignal.sendTag('id', this.getIdentifier())
    },
  },
  mounted() {
    this.$OneSignal.push(() => {
      this.$OneSignal.log.setLevel('warn')
      this.$OneSignal.sendTag('id', this.getIdentifier())
    })
    this.$OneSignal.push(() => {
      this.$OneSignal.isPushNotificationsEnabled((enabled) => {
        if (enabled) {
          console.log('Push notifications are enabled!')
        } else {
          console.log('Push notifications are not enabled yet.')
        }
        this.notify = enabled
      })
    })
  },
  methods: {
    toggleDarkMode(): void {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
    logout(): void {
      this.$auth.logout()
      this.$flash("You're logged out")
    },
    enableNotifications(): void {
      if (this.notify) {
        this.sendNotification()
      } else {
        this.$OneSignal.push(() => {
          this.$OneSignal.showSlidedownPrompt()
        })
        this.$OneSignal.push(() => {
          this.$OneSignal.isPushNotificationsEnabled((enabled: boolean) => {
            this.notify = enabled
            if (enabled) {
              this.sendNotification()
            } else {
              console.log('Push notifications are still not enabled yet.')
            }
          })
        })
      }
    },
    sendNotification(): void {
      this.$oneSignalApi.post('onesignal', {
        identifier: this.getIdentifier(),
        headings: {
          en: 'Notification test',
          ja: 'Notify person with id ' + this.getIdentifier(),
        },
        contents: {
          en: 'This is a notification test',
          ja: 'notifying person with id ' + this.getIdentifier(),
        },
      })
    },
    getIdentifier(): string {
      return this.$auth.user ? this.$auth.user.id : 'guest'
    },
  },
}
</script>
<style lang="scss" scoped>
.v-toolbar__title {
  cursor: pointer;
}
</style>
