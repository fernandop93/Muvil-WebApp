<template>
  <v-container>
    <v-row>
      <v-col align="right">
        <v-btn
          color="yellow darken-3"
          dark
          class="mb-2 mx-2"
          @click="edit()"
          v-if="!modoEdicion"
        >
          Editar
        </v-btn>
        <v-btn
          color="yellow darken-3"
          dark
          class="mb-2 mx-2"
          @click="cancel()"
          v-if="modoEdicion"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="yellow darken-3"
          dark
          class="mb-2 mx-2"
          @click="save()"
          v-if="modoEdicion"
        >
          Guardar
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col md="6">
        <v-card class="pa-2">
          <v-card-title>
            <span class="text-h5">Conductor</span>
          </v-card-title>
          <v-container fill-height fluid>
            <v-container fluid class="pa-1">
              <v-row>
                <v-col md="6">
                  <v-text-field
                    v-model="editedItem.driverName"
                    label="Nombre"
                    :disabled="!modoEdicion && isEmpty(editedItem.driverName)"
                    :readonly="!modoEdicion && !isEmpty(editedItem.driverName)"
                    v-on:keypress="validarLetrasEspacios($event)"
                  ></v-text-field>
                </v-col>
                <v-col md="3">
                  <v-text-field
                    v-model="editedItem.driverDNI"
                    label="DNI"
                    :disabled="!modoEdicion && isEmpty(editedItem.driverDNI)"
                    :readonly="!modoEdicion && !isEmpty(editedItem.driverDNI)"
                    v-on:keypress="validarNumeros($event)"
                  ></v-text-field>
                </v-col>
                <v-col md="3">
                  <v-text-field
                    v-model="editedItem.driverNumber"
                    label="Número"
                    :disabled="!modoEdicion && isEmpty(editedItem.driverNumber)"
                    :readonly="
                      !modoEdicion && !isEmpty(editedItem.driverNumber)
                    "
                    v-on:keypress="validarNumeros($event)"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-container>
        </v-card>
      </v-col>
      <v-col md="6">
        <v-card class="pa-2">
          <v-card-title>
            <span class="text-h5">Vehículo</span>
          </v-card-title>
          <v-container fill-height fluid>
            <v-container fluid class="pa-1">
              <v-row>
                <v-col md="3">
                  <v-text-field
                    v-model="editedItem.vehicleBrand"
                    label="Marca"
                    :disabled="!modoEdicion && isEmpty(editedItem.vehicleBrand)"
                    :readonly="
                      !modoEdicion && !isEmpty(editedItem.vehicleBrand)
                    "
                    v-on:keypress="validarLetrasEspacios($event)"
                  >
                  </v-text-field>
                </v-col>
                <v-col md="3">
                  <v-text-field
                    v-model="editedItem.vehicleModel"
                    label="Modelo"
                    :disabled="!modoEdicion && isEmpty(editedItem.vehicleModel)"
                    :readonly="
                      !modoEdicion && !isEmpty(editedItem.vehicleModel)
                    "
                    v-on:keypress="validarLetrasEspacios($event)"
                  >
                  </v-text-field>
                </v-col>
                <v-col md="3">
                  <v-text-field
                    v-model="editedItem.vehicleColor"
                    label="Color"
                    :disabled="!modoEdicion && isEmpty(editedItem.vehicleColor)"
                    :readonly="
                      !modoEdicion && !isEmpty(editedItem.vehicleColor)
                    "
                    v-on:keypress="validarLetrasEspacios($event)"
                  >
                  </v-text-field>
                </v-col>
                <v-col md="3">
                  <v-text-field
                    v-model="editedItem.vehiclePlate"
                    label="Placa"
                    :disabled="!modoEdicion && isEmpty(editedItem.vehiclePlate)"
                    :readonly="
                      !modoEdicion && !isEmpty(editedItem.vehiclePlate)
                    "
                    v-on:keypress="validarPlaca($event)"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="start">
      <v-col md="6">
        <v-card class="pa-2">
          <v-card-title>
            <span class="text-h5">Horario del servicio</span>
          </v-card-title>
          <v-container fill-height fluid>
            <v-container fluid class="pa-1">
              <v-row>
                <v-col md="6">
                  <v-text-field
                    v-model="editedItem.serviceStart"
                    label="Inicio"
                    :disabled="!modoEdicion && isEmpty(editedItem.serviceStart)"
                    :readonly="
                      !modoEdicion && !isEmpty(editedItem.serviceStart)
                    "
                    v-on:keypress="validarHora($event)"
                  >
                  </v-text-field>
                </v-col>
                <v-col md="6">
                  <v-text-field
                    v-model="editedItem.serviceEnd"
                    label="Fin"
                    :disabled="!modoEdicion && isEmpty(editedItem.serviceEnd)"
                    :readonly="!modoEdicion && !isEmpty(editedItem.serviceEnd)"
                    v-on:keypress="validarHora($event)"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    editedItem: {
      idOperator: 0,
      name: "",
      password: "",
      mail: "",
      createdDate: "",
      status: 0,
      phone: "",
      driverName: "",
      driverDNI: "",
      driverNumber: "",
      vehicleBrand: "",
      vehicleColor: "",
      vehicleModel: "",
      vehiclePlate: "",
      serviceStart: "",
      serviceEnd: "",
      iotURL: "",
    },
    originalItem: {
      idOperator: 0,
      name: "",
      password: "",
      mail: "",
      createdDate: "",
      status: 0,
      phone: "",
      driverName: "",
      driverDNI: "",
      driverNumber: "",
      vehicleBrand: "",
      vehicleColor: "",
      vehicleModel: "",
      vehiclePlate: "",
      serviceStart: "",
      serviceEnd: "",
      iotURL: "",
    },
    modoEdicion: false,
  }),

  created() {
    this.copiarBenA(this.originalItem, this.$store.state.user);
    this.copiarBenA(this.editedItem, this.originalItem);
  },

  methods: {
    async save() {
      try {
        await axios.put(
          this.$store.state.backBaseURL +
            "/api/operator/" +
            this.editedItem.idOperator,
          this.editedItem
        );
        this.copiarBenA(this.originalItem, this.editedItem);
        this.$store.commit("storeLoggedInUser", this.originalItem);
        this.modoEdicion = false;
      } catch (error) {
        console.log(error);
      }
    },
    cancel() {
      this.copiarBenA(this.editedItem, this.$store.state.user);
      this.modoEdicion = false;
    },
    edit() {
      this.modoEdicion = true;
    },
    isEmpty: function (str) {
      return str === "";
    },
    copiarBenA: function (a, b) {
      a.idOperator = b.idOperator;
      a.name = b.name;
      a.password = b.password;
      a.mail = b.mail;
      a.createdDate = b.createdDate;
      a.status = b.status;
      a.phone = b.phone;
      a.driverName = b.driverName;
      a.driverDNI = b.driverDNI;
      a.driverNumber = b.driverNumber;
      a.vehicleBrand = b.vehicleBrand;
      a.vehicleColor = b.vehicleColor;
      a.vehicleModel = b.vehicleModel;
      a.vehiclePlate = b.vehiclePlate;
      a.serviceStart = b.serviceStart;
      a.serviceEnd = b.serviceEnd;
      a.iotURL = b.iotURL;
    },
    validarLetrasEspacios(e) {
      let char = String.fromCharCode(e.keyCode);
      if (/^[A-Za-z]+$/.test(char) || char == " ") return true;
      else e.preventDefault();
    },
    validarNumeros(e) {
      let char = String.fromCharCode(e.keyCode);
      if (/^[0-9]*$/.test(char)) return true;
      else e.preventDefault();
    },
    validarMail(e) {
      let char = String.fromCharCode(e.keyCode);
      if (
        /^[A-Za-z]+$/.test(char) ||
        char == "@" ||
        char == "." ||
        char == "_" ||
        char == "-" ||
        /^[0-9]*$/.test(char)
      )
        return true;
      else e.preventDefault();
    },
    validarHora(e) {
      let char = String.fromCharCode(e.keyCode);
      if (char == ":" || /^[0-9]*$/.test(char)) return true;
      else e.preventDefault();
    },
    validarPlaca(e) {
      let char = String.fromCharCode(e.keyCode);
      if (/^[A-Za-z]+$/.test(char) || char == "-" || /^[0-9]*$/.test(char))
        return true;
      else e.preventDefault();
    },
  },
};
</script>