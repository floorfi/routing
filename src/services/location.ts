import { createStore } from 'vuex'
import {Step} from "@/models/step.model";
import {Location} from "@/models/location.model";
import {Route} from "@/models/route.model";
import {inject, reactive, readonly} from "vue";
import {Map} from "mapbox-gl";
import routeService from "./route"


const state = reactive({
    locations: [] as Location[]
})

const addLocation = (location: Location) => {
    state.locations.push(location)
}
const removeLocation = (id: string) => {
    state.locations = state.locations.filter((location: Location) => {
        return location.id !== id
    })
}

const getTravelDistanceToLocation = (id: string) => {
    let travelTime: number = 0;
    const locationIndex = state.locations.findIndex(location => location.id === id);

    // Erster Stop -> 0
    if(locationIndex !== 0) {
        routeService.state.routes.every((route, index) => {
            if(index >= locationIndex){
                return false
            } else {
                console.log('add' + route.travelTime)
                travelTime += route.travelTime
            }
        })
    }
    return travelTime

}

const getlocationByID = (id: string): Location|undefined => {
    return state.locations.find(location => location.id === id)
}

const reindex = () => {
    state.locations.filter((location: Location) => location)
}

export default {
    state: readonly(state),
    getlocationByID,
    addLocation,
    removeLocation,
    getTravelDistanceToLocation,
    reindex
}
