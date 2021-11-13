<template>
  <div>
    <v-app-bar color="blue darken-4" dense>
      <v-btn
        v-if="usuarioEsAdmin()"
        @click="cambiarSeccion(1)"
        color="white"
        text
      >
        <router-link
          style="text-decoration: none; color: inherit"
          to="/operator"
          >Gestión de operarios</router-link
        >
      </v-btn>
      <v-btn
        v-if="!usuarioEsAdmin()"
        @click="cambiarSeccion(2)"
        color="white"
        text
      >
        <router-link style="text-decoration: none; color: inherit" to="/service"
          >Servicio de movilidad</router-link
        >
      </v-btn>
      <v-btn
        v-if="!usuarioEsAdmin()"
        @click="cambiarSeccion(3)"
        color="white"
        text
      >
        <router-link style="text-decoration: none; color: inherit" to="/school"
          >Centros Educativos</router-link
        >
      </v-btn>
      <v-btn
        v-if="!usuarioEsAdmin()"
        @click="cambiarSeccion(4)"
        color="white"
        text
      >
        <router-link style="text-decoration: none; color: inherit" to="/child"
          >Menores</router-link
        >
      </v-btn>
      <v-btn
        v-if="!usuarioEsAdmin()"
        @click="cambiarSeccion(5)"
        color="white"
        text
      >
        <router-link style="text-decoration: none; color: inherit" to="/vehicule"
          >Conectividad</router-link
        >
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="white" text>
        <router-link style="text-decoration: none; color: inherit" to="/"
          >Cerrar sesión</router-link
        >
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      seccionSeleccionada: 1,
    };
  },
  methods: {
    cambiarSeccion: function (i) {
      this.seccionSeleccionada = i;
    },
    usuarioEsAdmin() {
      return this.$store.state.user.idOperator == -1;
    },
    mounted() {
      if (this.usuarioEsAdmin()) this.seccionSeleccionada = 1;
      else this.seccionSeleccionada = 2;
    },
  },
};
</script>