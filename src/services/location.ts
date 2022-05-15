import { createStore } from 'vuex'
import {Step} from "@/models/step.model";
import {Location} from "@/models/location.model";
import {Route} from "@/models/route.model";
import {inject, reactive, readonly} from "vue";
import {Map} from "mapbox-gl";

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
    reindex
}
