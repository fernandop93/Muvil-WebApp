<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="name"
      class="elevation-1"
      :footer-props="{itemsPerPageText: 'Elementos por página', pageText: '{0} de {1}'}"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Operarios de movilidad escolar</v-toolbar-title>

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
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.phone"
                        label="Número"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <!--                       <v-text-field
                        v-model="editedItem.status"
                        :items="opciones"
                        label="Estado"
                      ></v-text-field> -->
                      <v-select
                        v-model="editedItem.statusName"
                        :items="opciones"
                        label="Estado"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.mail"
                        label="Correo"
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
                <v-btn color="yellow darken-3" dark @click="save">
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
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Nombre",
        align: "start",
        value: "name",
      },
      { text: "Correo electrónico", value: "mail" },
      { text: "Fecha de creación", value: "createdDateFormated" },
      { text: "Estado", value: "statusName" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    items: [],
    opciones: ["Activo", "Inactivo"],
    editedIndex: -1,
    editedItem: {
      name: "",
      mail: "",
      createdDate: "",
      status: 1,
      statusName: "Activo",
      password: "123456!",
      idOperador: 0,
      createdDateFormated: "",
    },
    defaultItem: {
      name: "",
      mail: "",
      createdDate: "",
      status: 1,
      statusName: "Activo",
      password: "123456!",
      idOperador: 0,
      createdDateFormated: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo" : "Editar";
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
    try {
      let response = await axios.get(
        this.$store.state.backBaseURL + "/api/operator"
      );
      response.data.map((item) => {
        if (item.status == 1) item.statusName = "Activo";
        else item.statusName = "Inactivo";
        const fecha = new Date(item.createdDate);
        item.createdDateFormated =
          "" + fecha.toLocaleDateString() + " " + fecha.toLocaleTimeString();
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
            "/api/operator/" +
            this.editedItem.idOperator
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
      if (this.editedItem.statusName == "Activo") this.editedItem.status = 1;
      else this.editedItem.status = 0;
      if (this.editedIndex > -1) {
        //update
        Object.assign(this.items[this.editedIndex], this.editedItem);
        try {
          await axios.put(
            this.$store.state.backBaseURL +
              "/api/operator/" +
              this.editedItem.idOperator,
            this.editedItem
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        //create

        const hoy = new Date();
        this.editedItem.createdDate = hoy.toUTCString();
        this.editedItem.createdDateFormated =
          "" + hoy.toLocaleDateString() + " " + hoy.toLocaleTimeString();
        this.items.push(this.editedItem);
        try {
          await axios.post(
            this.$store.state.backBaseURL + "/api/operator",
            this.editedItem
          );
        } catch (error) {
          console.log(error);
        }
      }
      this.close();
    },
  },
};
</script>