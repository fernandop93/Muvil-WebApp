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
          <v-toolbar-title>Menores</v-toolbar-title>

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
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.childName"
                        label="Nombre del menor"
                        v-on:keypress="validarLetrasEspacios($event)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.parentName"
                        label="Nombre del padre o tutor"
                        v-on:keypress="validarLetrasEspacios($event)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.mail"
                        label="Correo del padre o tutor"
                        v-on:keypress="validarMail($event)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        v-model="editedItem.phone"
                        label="Número del padre o tutor"
                        v-on:keypress="validarNumeros($event)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-select
                        v-model="editedItem.statusName"
                        :items="opciones"
                        label="Estado"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-select
                        v-model="editedItem.district"
                        :items="opcionesDistritos"
                        label="Distrito"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="9">
                      <v-text-field
                        v-model="editedItem.adress"
                        label="Dirección"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="12">
                      <v-select
                        v-model="editedItem.schoolName"
                        :items="schoolsName"
                        label="Centro educativo"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="12">
                      <GmapMap
                        ref="mapRef"
                        :center.sync="editedItem.centroOriginal"
                        :zoom="15"
                        style="width: 100%; height: 200px"
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
          <v-dialog v-model="dialogAlert" max-width="800px">
            <v-card>
              <v-card-title>
                <span class="text-h5">Enviar alerta</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="12">
                      <v-text-field
                        v-model="newAlert.content"
                        label="Mensaje"
                      ></v-text-field>
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
                  :dark="newAlert.content.length >= 10"
                  @click="saveAlert"
                  :disabled="newAlert.content.length < 10"
                >
                  Grabar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small class="mr-2" @click="sendAlert(item)"> mdi-bell </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    dialog: false,
    dialogAlert: false,
    dialogDelete: false,
    headers: [
      {
        text: "Nombre del menor",
        align: "start",
        value: "childName",
      },
      { text: "Padre o tutor", value: "parentName" },
      { text: "Correo electrónico", value: "mail" },
      { text: "Centro educativo", value: "schoolName" },
      { text: "Estado", value: "statusName" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    items: [],
    editedIndex: -1,
    editedItem: {
      idParent: 0,
      mail: "",
      password: "123456!",
      parentName: "",
      childName: "",
      latitude: 0,
      longitude: 0,
      status: 1,
      adress: "",
      district: "",
      phone: "",
      operator_idOperator: 0,
      school_idSchool: 0,
      schoolName: "",
      statusName: "",
      centroOriginal: { lat: -12.09476657372091, lng: -77.01566388518756 },
      centroMarcador: { lat: -12.09476657372091, lng: -77.01566388518756 },
    },
    defaultItem: {
      idParent: 0,
      mail: "",
      password: "123456!",
      parentName: "",
      childName: "",
      latitude: 0,
      longitude: 0,
      status: 1,
      adress: "",
      district: "",
      phone: "",
      operator_idOperator: 0,
      school_idSchool: 0,
      schoolName: "",
      statusName: "",
      centroOriginal: { lat: -12.09476657372091, lng: -77.01566388518756 },
      centroMarcador: { lat: -12.09476657372091, lng: -77.01566388518756 },
    },
    schoolsName: [],
    schoolsID: [],
    schools: [],
    opciones: ["Activo", "Inactivo"],
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
    newAlert:{
      content: "",
      date: "",
      type: 1,
      parent_idParent: 0
    },
    defaultAlert:{
      content: "",
      date: "",
      type: 1,
      parent_idParent: 0
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo" : "Editar";
    },
    esPosibleGrabar() {
      return (
        this.editedItem.parentName.length >= 4 &&
        this.editedItem.childName.length >= 4 &&
        this.editedItem.statusName.length >= 1 &&
        this.editedItem.phone.length >= 7 &&
        this.editedItem.schoolName.length >= 4 &&
        this.editedItem.adress.length >= 4 &&
        this.editedItem.district.length >= 3 &&
        this.editedItem.mail.length >= 5
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
    dialogAlert(val) {
      val || this.closeDelete();
    },
  },

  async created() {
    this.defaultItem.operator_idOperator = this.$store.state.user.idOperator;
    this.editedItem.operator_idOperator = this.$store.state.user.idOperator;

    try {
      let response = await axios.get(
        this.$store.state.backBaseURL +
          "/api/parent/foroperator/" +
          this.$store.state.user.idOperator
      );
      try {
        let response = await axios.get(
          this.$store.state.backBaseURL +
            "/api/school/foroperator/" +
            this.$store.state.user.idOperator
        );
        response.data.map((item) => {
          this.schoolsName.push(item.name);
          this.schools.push(item);
        });
      } catch (error) {
        console.log(error);
      }

      response.data.map((item) => {
        if (item.status == 1) item.statusName = "Activo";
        else item.statusName = "Inactivo";
        item.centroOriginal = { lat: item.latitude, lng: item.longitude };
        item.centroMarcador = { lat: item.latitude, lng: item.longitude };
        item.schoolName = this.getNameColegio(item.school_idSchool);
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
    sendAlert(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.newAlert = Object.assign({}, this.defaultAlert);
      this.newAlert.parent_idParent = this.editedItem.idParent;
      const hoy = new Date();
      this.newAlert.date = hoy.toUTCString();
      this.dialogAlert = true;
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
            "/api/parent/" +
            this.editedItem.idParent
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
      this.dialogAlert = false;
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
      if (this.editedItem.statusName == "Activo") this.editedItem.status = 1;
      else this.editedItem.status = 0;
      this.editedItem.school_idSchool = this.getIdColegio(
        this.editedItem.schoolName
      );

      if (this.editedIndex > -1) {
        //update
        Object.assign(this.items[this.editedIndex], this.editedItem);
        try {
          await axios.put(
            this.$store.state.backBaseURL +
              "/api/parent/" +
              this.editedItem.idParent,
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
            this.$store.state.backBaseURL + "/api/parent",
            this.editedItem
          );
        } catch (error) {
          console.log(error);
        }
      }
      this.close();
    },
    getIdColegio(name) {
      let resultado = 0;
      this.schools.map((item) => {
        if (item.name == name) resultado = item.idSchool;
      });
      return resultado;
    },
    getNameColegio(id) {
      let resultado = "";
      this.schools.map((item) => {
        if (item.idSchool == id) resultado = item.name;
      });
      return resultado;
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

    async saveAlert() {
        try {
          await axios.post(
            this.$store.state.backBaseURL + "/api/notification",
            this.newAlert
          );
        } catch (error) {
          console.log(error);
        }
      
      this.close();
    },
  },
};
</script>