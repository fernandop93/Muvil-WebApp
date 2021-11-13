<template>
  <v-app>
    <v-main>
      <!-- Componente 'Menu' -->
      <Menu />

      <router-view>
        <v-content> </v-content>
      </router-view>

      <!-- Componente 'Footer' -->
      <Footer />
    </v-main>
  </v-app>
</template>
 
<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  text-align: center;
  color: #000000;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #b1ac70;
    text-decoration: none;

    &.router-link {
      color: #42b983;
      text-decoration: none;
    }
  }
}
</style>