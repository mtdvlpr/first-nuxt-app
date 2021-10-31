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
      <nuxt-link exact to="/">
        <v-img
          class="mx-2"
          src="/v.png"
          max-height="40"
          max-width="40"
          contain
        />
      </nuxt-link>
      <v-toolbar-title>Home</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn v-for="item in items" :key="item.title" :to="item.to" nuxt exact>
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
      <v-spacer />
      <v-toolbar-items class="hidden-xs-only">
        <v-btn icon @click="toggleDarkMode">
          <v-icon>mdi-brightness-6</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer
      :color="darkMode ? 'grey-darken-2' : 'black'"
      absolute
      padless
      app
    >
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
          <strong>first-nuxt-app</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'About us',
          to: '/about',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Contact us',
          to: '/contact',
        },
      ],
    }
  },
  computed: {
    darkMode() {
      return this.$vuetify.theme.dark
    },
  },
  methods: {
    toggleDarkMode() {
      this.$vuetify.theme.dark = !this.darkMode
    },
  },
}
</script>