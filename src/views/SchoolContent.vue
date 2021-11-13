<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="name"
      class="elevation-1"
      :footer-props="{
        itemsPerPageText: 'Elementos por página',
        pageText: '{0} de {1}',
      }"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Centros educativos</v-toolbar-title>

          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="800px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="yellow darken-3"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                Crear
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Nombre"
                        v-on:keypress="validarLetrasEspacios($event)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.adress"
                        label="Dirección"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.district"
                        :items="opcionesDistritos"
                        label="Distrito"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="12">
                      <GmapMap
                        ref="mapRef"
                        :center.sync="editedItem.centroOriginal"
                        :zoom="15"
                        style="width: 100%; height: 400px"
                        :options="{
                          zoomControl: true,
                          mapTypeControl: false,
                          scaleControl: false,
                          streetViewControl: false,
                          rotateControl: false,
                          fullscreenControl: false,
                          disableDefaultUi: false,
                        }"
                        @center_changed="updateCenter"
                      >
                        <GmapMarker
                          :position.sync="editedItem.centroMarcador"
                          :clickable="false"
                          :draggable="false"
                        />
                      </GmapMap>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="yellow darken-3" dark @click="close">
                  Cancelar
                </v-btn>
                <v-btn
                  color="yellow darken-3"
                  :dark="esPosibleGrabar"
                  @click="save"
                  :disabled="!esPosibleGrabar"
                >
                  Grabar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="700px">
            <v-card>
              <v-card-title class="text-h5"
                >¿Estás seguro que deseas eliminar permanentemente
                esto?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="yellow darken-3" dark @click="closeDelete"
                  >No</v-btn
                >
                <v-btn color="yellow darken-3" dark @click="deleteItemConfirm"
                  >Sí</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "GoogleMap",
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Nombre del establecimiento",
        align: "start",
        value: "name",
      },
      { text: "Dirección", value: "adress" },
      { text: "Distrito", value: "district" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    items: [],
    editedIndex: -1,
    editedItem: {
      idSchool: 0,
      latitude: 0,
      longitude: 0,
      adress: "",
      district: "",
      name: "",
      operator_idOperator: 0,
      centroOriginal: { lat: -12.09476657372091, lng: -77.01566388518756 },
      centroMarcador: { lat: -12.09476657372091, lng: -77.01566388518756 },
    },
    defaultItem: {
      idSchool: 0,
      latitude: 0,
      longitude: 0,
      adress: "",
      district: "",
      name: "",
      operator_idOperator: 0,
      centroOriginal: { lat: -12.09476657372091, lng: -77.01566388518756 },
      centroMarcador: { lat: -12.09476657372091, lng: -77.01566388518756 },
    },
    opcionesDistritos: [
      "Ancón",
      "Ate Vitarte",
      "Barranco",
      "Breña",
      "Carabayllo",
      "Chaclacayo",
      "Chorrillos",
      "Cieneguilla",
      "Comas",
      "El Agustino",
      "Independencia",
      "Jesús María",
      "La Molina",
      "La Victoria",
      "Lima",
      "Lince",
      "Los Olivos",
      "Lurigancho",
      "Lurín",
      "Magdalena del Mar",
      "Miraflores",
      "Pachacamac",
      "Pucusana",
      "Pueblo Libre",
      "Puente Piedra",
      "Punta Hermosa",
      "Punta Negra",
      "Rímac",
      "San Bartolo",
      "San Borja",
      "San Isidro",
      "San Juan de Lurigancho",
      "San Juan de Miraflores",
      "San Luis",
      "San Martín de Porres",
      "San Miguel",
      "Santa Anita",
      "Santa María del Mar",
      "Santa Rosa",
      "Santiago de Surco",
      "Surquillo",
      "Villa El Salvador",
      "Villa María del Triunfo",
    ],
  }),

  mounted: function () {},

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo" : "Editar";
    },
    esPosibleGrabar() {
      return (
        this.editedItem.adress.length >= 4 &&
        this.editedItem.district.length >= 3 &&
        this.editedItem.name.length >= 3
      );
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  async created() {
    this.defaultItem.operator_idOperator = this.$store.state.user.idOperator;
    this.editedItem.operator_idOperator = this.$store.state.user.idOperator;
    try {
      let response = await axios.get(
        this.$store.state.backBaseURL +
          "/api/school/foroperator/" +
          this.$store.state.user.idOperator
      );
      response.data.map((item) => {
        item.centroOriginal = { lat: item.latitude, lng: item.longitude };
        item.centroMarcador = { lat: item.latitude, lng: item.longitude };
        this.items.push(item);
      });
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        await axios.delete(
          this.$store.state.backBaseURL +
            "/api/school/" +
            this.editedItem.idSchool
        );
        this.items.splice(this.editedIndex, 1);
        this.closeDelete();
      } catch (error) {
        console.log(error);
      }
      this.items.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      this.editedItem.latitude = this.editedItem.centroMarcador.lat;
      this.editedItem.longitude = this.editedItem.centroMarcador.lng;
      this.editedItem.centroOriginal.lat = this.editedItem.centroMarcador.lat;
      this.editedItem.centroOriginal.lng = this.editedItem.centroMarcador.lng;
      if (this.editedIndex > -1) {
        //update
        Object.assign(this.items[this.editedIndex], this.editedItem);
        try {
          await axios.put(
            this.$store.state.backBaseURL +
              "/api/school/" +
              this.editedItem.idSchool,
            this.editedItem
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        //create
        this.items.push(this.editedItem);
        console.log(this.editedItem);
        try {
          await axios.post(
            this.$store.state.backBaseURL + "/api/school",
            this.editedItem
          );
        } catch (error) {
          console.log(error);
        }
      }
      this.close();
    },
    updateCenter(center) {
      this.editedItem.centroMarcador = {
        lat: center.lat(),
        lng: center.lng(),
      };
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
  },
};
</script>