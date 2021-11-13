<template>
  <v-container>
    <v-row justify="center">
      <v-col md="12">
        <v-card class="pa-2">
          <v-card-title>
            <span class="text-h5">Fuente de información</span>
          </v-card-title>
          <v-container fill-height fluid>
            <v-container fluid class="pa-1">
              <v-row>
                <v-col md="10">
                  <v-text-field
                    v-model="editedItemIoT.iotURL"
                    label="URL"
                    :disabled="!modoEdicion && isEmpty(editedItemIoT.iotURL)"
                    :readonly="!modoEdicion && !isEmpty(editedItemIoT.iotURL)"
                    v-on:keypress="validarSinEspacio($event)"
                  ></v-text-field>
                </v-col>
                <v-col md="2">
                  <v-text-field
                    v-model="estadoIot"
                    label="Estado de conexión"
                    disabled
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col align="right" md="12">
                  <v-btn
                    color="yellow darken-3"
                    dark
                    class="mb-2 mx-2"
                    @click="cargarData()"
                    v-if="!modoEdicion"
                  >
                    Cargar información manualmente
                  </v-btn>
                  <v-btn
                    color="yellow darken-3"
                    dark
                    class="mb-2 mx-2"
                    @click="actualizarEstadoIoT()"
                    v-if="!modoEdicion"
                  >
                    Actualizar estado de conexión
                  </v-btn>
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
                  <v-dialog v-model="dialogDataManual" max-width="800px">
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">Información del trayecto</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="12">
                              <v-file-input
                                label="Archivo para importar"
                                outlined
                                dense
                                accept=".json"
                                v-model="archivo"
                                @change="checkJSON"
                              ></v-file-input>
                            </v-col>
                            <v-col cols="12" sm="6" md="12">
                              <v-textarea
                                outlined
                                rows="1"
                                auto-grow
                                :disabled="true"
                                v-model="dataPorImportar"
                                label="Data a importar"
                              ></v-textarea>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="yellow darken-3"
                          dark
                          @click="closeCargarData"
                        >
                          Cancelar
                        </v-btn>
                        <v-btn
                          color="yellow darken-3"
                          dark
                          @click="importarDataYCerrar"
                        >
                          Importar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-container>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col md="12">
        <v-data-table
          :headers="headers"
          :items="items"
          sort-by="name"
          class="elevation-1 pa-2"
          :footer-props="{
            itemsPerPageText: 'Elementos por página',
            pageText: '{0} de {1}',
          }"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Historial de trayectos</v-toolbar-title>

              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="800px">
                <v-card>
                  <v-card-title>
                    <span class="text-h5">Información del trayecto</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.dateFormated"
                            label="Fecha"
                            disabled
                            readonly
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.start"
                            label="Inicio"
                            disabled
                            readonly
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.finish"
                            label="Fin"
                            disabled
                            readonly
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="12">
                          <GmapMap
                            ref="mapRef"
                            :center.sync="editedItem.centroMapa"
                            :zoom="14"
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
                          >
                            <Gmap-polyline
                              :path="editedItem.path"
                              :options="{ strokeColor: '#1F4A9B' }"
                            >
                            </Gmap-polyline>
                            <GmapMarker
                              :position="editedItem.path[0]"
                              :clickable="false"
                              :draggable="false"
                              label="I"
                            />
                            <GmapMarker
                              :position="
                                editedItem.path[editedItem.path.length - 1]
                              "
                              :clickable="false"
                              :draggable="false"
                              label="F"
                            />
                          </GmapMap>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="yellow darken-3" dark @click="close">
                      Aceptar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-eye
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    editedItemIoT: {
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
    estadoIot: "Inactivo",
    originalItemIoT: {
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
    dialog: false,
    dialogDataManual: false,
    headers: [
      {
        text: "Fecha",
        align: "start",
        value: "dateFormated",
      },
      { text: "Inicio", value: "start" },
      { text: "Fin", value: "finish" },
      { text: "Acciones", value: "actions", align: "center", sortable: false },
    ],
    items: [],
    editedIndex: -1,
    editedItem: {
      date: "",
      lastGpsStatus: 0,
      lastCamaraStatus: 0,
      videoFeedURL: "",
      idCourse: 0,
      operator_idOperator: 0,
      todaysLocations: [],
      dateFormated: "",
      path: [],
    },
    defaultItem: {
      date: "",
      lastGpsStatus: 0,
      lastCamaraStatus: 0,
      videoFeedURL: "",
      idCourse: 0,
      operator_idOperator: 0,
      todaysLocations: [],
      dateFormated: "",
      path: [],
    },
    dataPorImportar: "",
    archivo: null,
    nuevo: {
      lastGpsStatus: 0,
      lastCamaraStatus: 0,
      videoFeedURL: "",
      operator_idOperator: -1,
    },
    nuevoDot: {
      latitude: 0,
      longitude: 0,
      timestamp: "",
      course_idCourse: -1,
    },
  }),
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDataManual(val) {
      val || this.close();
    },
  },

  async created() {
    this.copiarBenA(this.originalItemIoT, this.$store.state.user);
    this.copiarBenA(this.editedItemIoT, this.originalItemIoT);
    this.actualizarEstadoIoT();

    try {
      let response = await axios.get(
        this.$store.state.backBaseURL +
          "/api/course/foroperator/" +
          this.$store.state.user.idOperator
      );
      response.data.map((item) => {
        item.centroMapa = {
          lat: item.todaysLocations[0].latitude,
          lng: item.todaysLocations[0].longitude,
        };
        const fecha = new Date(item.date);
        item.dateFormated =
          fecha.getDay() +
          " de " +
          fecha.toLocaleString("default", { month: "long" }) +
          " del " +
          fecha.getFullYear();
          
        item.todaysLocations.sort((a, b) =>
          new Date(a.timestamp) > new Date(b.timestamp) ? 1 : -1
        );
        var max = new Date(
          item.todaysLocations[item.todaysLocations.length - 1].timestamp
        );
        var min = new Date(item.todaysLocations[0].timestamp);
        var dots = [];
        item.todaysLocations.map((location) => {
          const dot = { lat: location.latitude, lng: location.longitude };
          dots.push(dot);
        });
        item.start = min.toLocaleTimeString();
        item.finish = max.toLocaleTimeString();
        item.path = dots;

        this.items.push(item);
      });
    } catch (error) {
      console.log(error);
    }
  },

  methods: {
    async save() {
      try {
        await axios.put(
          this.$store.state.backBaseURL +
            "/api/operator/" +
            this.editedItemIoT.idOperator,
          this.editedItemIoT
        );
        this.copiarBenA(this.originalItemIoT, this.editedItemIoT);
        this.$store.commit("storeLoggedInUser", this.originalItemIoT);
        this.modoEdicion = false;
        this.actualizarEstadoIoT();
      } catch (error) {
        console.log(error);
      }
    },
    cancel() {
      this.copiarBenA(this.editedItemIoT, this.$store.state.user);
      this.modoEdicion = false;
      this.actualizarEstadoIoT();
    },
    edit() {
      this.modoEdicion = true;
      this.actualizarEstadoIoT();
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
    validarSinEspacio(e) {
      let char = String.fromCharCode(e.keyCode);
      if (char == " ") e.preventDefault();
      else return true;
    },
    actualizarEstadoIoT() {
      //reemplazar por validación real
      if (this.isEmpty(this.originalItemIoT.iotURL) || this.modoEdicion)
        this.estadoIot = "Inactivo";
      else this.estadoIot = "Activo";
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeCargarData() {
      this.dataPorImportar = "";
      this.archivo = null;
      this.dialogDataManual = false;
    },
    async importarDataYCerrar() {
      const dataJSON = JSON.parse(this.dataPorImportar);
      //console.log(dataJSON);

      //console.log(dataJSON.videoFeedURL);

      const fecha = new Date(dataJSON.timeStamp);
      const fechaFormateada =
        fecha.getDay() +
        " de " +
        fecha.toLocaleString("default", { month: "long" }) +
        " del " +
        fecha.getFullYear();

      //chequear si existe course
      var existe = false;
      this.items.map((item) => {
        if (item.dateFormated == fechaFormateada) {
          existe = true;
          //si existe, se actualiza
          const fechaMax = new Date(
            item.todaysLocations[item.todaysLocations.length - 1].timestamp
          );
          dataJSON.todaysCapturedLocations.map((dot) => {
            const fechaDot = new Date(dot.timestamp);
            if (fechaDot.getTime() > fechaMax.getTime()) {
              //crear vehicule location
              console.log("crear vehicule location");
            }
          });

          item.lastGpsStatus = dataJSON.lastGpsStatus;
          item.lastCamaraStatus = dataJSON.lastCamaraStatus;
          item.videoFeedURL = dataJSON.videoFeedURL;

          //actualizar trayecto con item
        }
      });
      if (!existe) {
        console.log("asdddddd");
        this.nuevo.date = dataJSON.timeStamp;
        this.nuevo.lastGpsStatus = dataJSON.gpsStatus;
        this.nuevo.lastCamaraStatus = dataJSON.cameraStatus;
        this.nuevo.videoFeedURL = dataJSON.videoFeedURL;
        this.nuevo.operator_idOperator = this.$store.state.user.idOperator;
        //crear con servicio, recobrar el ID
        try {
          let response = await axios.post(
            this.$store.state.backBaseURL + "/api/course",
            this.nuevo
          );
          let idCourse = response.data.idCourse;
          dataJSON.todaysCapturedLocations.map((item) => {
            this.nuevoDot.latitude = item.latitude;
            this.nuevoDot.longitude = item.longitude;
            this.nuevoDot.timestamp = item.timestamp;
            this.nuevoDot.course_idCourse = idCourse;
            //console.log(this.nuevoDot)
            try {
              axios.post(
                this.$store.state.backBaseURL + "/api/vehiculelocation",
                this.nuevoDot
              );
            } catch (error) {
              console.log(error);
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
      this.closeCargarData();
      //refresh
    },
    cargarData() {
      this.dialogDataManual = true;
    },
    checkJSON: function (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.dataPorImportar = e.target.result;
      };
      reader.readAsText(file);
    },
  },
};
</script>