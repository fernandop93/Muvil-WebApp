import Vue from "vue";
import Vuex from "vuex";
 
Vue.use(Vuex);
 
export default new Vuex.Store({
 state: {
    user:{
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
    backBaseURL: "http://ec2-174-129-52-23.compute-1.amazonaws.com:8080"
    //backBaseURL: "http://localhost:8080"
 },
 getters: {},
 mutations: {
    storeLoggedInUser(state, payload){
        state.user.idOperator = payload.idOperator;
        state.user.name = payload.name;
        state.user.password = payload.password;
        state.user.mail = payload.mail;
        state.user.createdDate = payload.createdDate;
        state.user.status = payload.status;
        state.user.phone = payload.phone;
        state.user.driverName = payload.driverName;
        state.user.driverDNI = payload.driverDNI;
        state.user.driverNumber = payload.driverNumber;
        state.user.vehicleBrand = payload.vehicleBrand;
        state.user.vehicleColor = payload.vehicleColor;
        state.user.vehicleModel = payload.vehicleModel;
        state.user.vehiclePlate = payload.vehiclePlate;
        state.user.serviceStart = payload.serviceStart;
        state.user.serviceEnd = payload.serviceEnd;
        state.user.iotURL = payload.iotURL;
    }
 },
 actions: {}
});