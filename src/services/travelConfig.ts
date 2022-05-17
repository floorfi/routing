import {Step} from "@/models/step.model";
import {Map} from "mapbox-gl";
import {Location} from "@/models/location.model";
import {reactive, readonly} from "vue";
import {Route} from "@/models/route.model";
import mapService from "./map"
import routeService from "./route"
import locationService from "./location"
import location from "./location";
import {TravelConfig} from "@/models/travelConfig.model";
import moment from "moment";

const state = reactive({
    config: {
        start: moment(),
        label: 'Meine Reise',
        maxDrivingTime: 120
    } as TravelConfig
})


export default {
    state: readonly(state)
}