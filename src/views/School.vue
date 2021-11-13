<template>
  <v-app>
    <v-main>
      <Menu />
        <SchoolContent />
        <router-view>
          <v-content> </v-content>
        </router-view>
    </v-main>
  </v-app>
</template>

<script>
import Menu from "./Menu";
import SchoolContent from "./SchoolContent";

export default {
  name: "Home",

  watch: {
    $route: {
      immediate: true,
      handler(to) {
        document.title = to.meta.title || "Muvil";
      },
    },
  },

  components: {
    Menu,
    SchoolContent,
  },

  data: () => ({
    //
  }),
};
</script>