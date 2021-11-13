<template>
  <v-app>
    <v-main>
      <LoginContent />
      <router-view>
        <v-content> </v-content>
      </router-view>
    </v-main>
  </v-app>
</template>

<script>
import LoginContent from "./LogContent";

export default {
  name: "Login",

  watch: {
    $route: {
      immediate: true,
      handler(to) {
        document.title = to.meta.title || "Muvil";
      },
    },
  },

  components: {
    LoginContent,
  },

  data: () => ({
    //
  }),
};
</script>