<template >
  <div class="fill-height blue darken-4" height="100%">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex>
          <v-card
            class="d-flex align-center mb-6 mx-auto"
            max-width="400"
            tile
            flat
            color="transparent"
          >
            <v-container fill-height fluid>
              <v-container fluid class="pa-10">
                <v-img
                  class="mx-auto"
                  max-width="250"
                  :src="require('../assets/muvil.svg')"
                ></v-img>
              </v-container>

              <v-text-field
                v-model="email"
                label="Correo electrónico"
                solo
              ></v-text-field>
              <v-text-field
                :append-icon="showP ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showP ? 'text' : 'password'"
                name="input-10-2"
                label="Contraseña"
                value=""
                class="input-group--focused"
                v-model="password"
                solo
                @click:append="showP = !showP"
              ></v-text-field>
              <v-btn
                block
                dark
                color="yellow darken-3"
                :loading="loading"
                :disabled="logueoPosible"
                @click="loader = 'loading'"
              >
                Acceder
              </v-btn>
              <v-snackbar v-model="snackbar">
                Correo electrónico o contraseña inválidos

                <template v-slot:action="{ attrs }">
                  <v-btn
                    color="yellow darken-3"
                    text
                    v-bind="attrs"
                    @click="snackbar = false"
                  >
                    Cerrar
                  </v-btn>
                </template>
              </v-snackbar>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    snackbar: false,
    email: "",
    password: "",
    loader: null,
    loading: false,
    idUsuario: -1,
    patern:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    showP: false,
    user: {
      idOperator: 0,
      name: "",
      password: "",
      mail: "",
      createdDate: "",
      status: 0,
      phone: "",
      driverName: "",
      driverDNI: 1,
      driverNumber: "",
      vehiculeBrand: "",
      vehiculeColor: "",
      vehiculeModel: "",
      vehiculePlate: "",
      serviceStart: "",
      serviceEnd: "",
      iotURL: "",
    },
    responseJSON: [],
    // rules: {
    //   required: (value) => !!value || "Correo electrónico obligatorio",
    //   //counter: value => value.length <= 20 || 'Max 20 characters',
    //   email: (value) => {
    //     const pattern =
    //       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //     return pattern.test(value) || "Correo electrónico inválido";
    //   },
    // },
  }),
  computed: {
    logueoPosible() {
      //return (this.pattern.test(this.email) && this.password.length > 6);
      return !(
        this.email.match(this.patern) &&
        this.password.length >= 6 &&
        !this.loading
      );
    },
  },
  methods: {
    login() {
      return null;
    },
  },
  watch: {
    async loader() {
      const l = this.loader;
      this[l] = !this[l];

      let body = {
        mail: this.email,
        password: this.password,
      };

      try {
        this[l] = false;
        let response = await axios.post(
          this.$store.state.backBaseURL + "/api/operator/login",
          body
        );
        this.responseJSON = response;
      } catch (error) {
        console.log(error);
      } finally {
        if (this.responseJSON.status == 200) {
          this.user = this.responseJSON.data;
          //console.log(this.user);
          this.$store.commit("storeLoggedInUser", this.user);
          if (this.$store.state.user.idOperator == -1)
            this.$router.replace("operator");
          else this.$router.replace("service");
        } else if (this.responseJSON.status == 204) {
          //no existe ese usuario
          this.snackbar = true;
        }
        this.loader = null;
      }
    },
  },
};
</script>