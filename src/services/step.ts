import {Step} from "@/models/step.model";
import {Map} from "mapbox-gl";
import {Location} from "@/models/location.model";
import {reactive, readonly} from "vue";
import {Route} from "@/models/route.model";
import mapService from "./map"
import routeService from "./route"
import locationService from "./location"
import location from "./location";

const state = reactive({
    steps: [] as Step[]
})

const addStep = (step: Step) => {
    state.steps.push(step)
}

const updateStep = (step: Step) => {
    let stepToUpdate = state.steps.find(stateStep => stateStep.id === step.id)
    stepToUpdate = step
}

const removeStep = (id: string) => {
    state.steps = state.steps.filter((step: Step) => {
        return step.id !== id
    })
}

const removeStop = (stepID: string) => {
    const stepToRemove: Step = state.steps.find((step: Step) => step.id === stepID)!;
    const indexToRemove: number = state.steps.findIndex((step: Step) => step.id === stepID);
    let previousStep: Step|null = null;
    let followingStep: Step|null = null;

    // Vorherige routeTo entfernen
    routeService.removeRoute(stepID);
    mapService.removeLayer(stepID);

    // Gibt es einen vorherigen Step?
    if(state.steps[indexToRemove-1]) {
        previousStep = state.steps[indexToRemove-1];
    }

    // Gibt es einen Folgestep?
    if(state.steps[indexToRemove+1]) {
        followingStep = state.steps[indexToRemove+1];
        routeService.removeRoute(followingStep!.id);
        mapService.removeLayer(followingStep!.id);
    }

    // Recalculate route (if more than one step left)
    if(previousStep && followingStep){
        const previousLocation = locationService.getlocationByID(previousStep.id)!
        const followingLocation = locationService.getlocationByID(followingStep.id)!
        routeService.getRoute(previousLocation, followingLocation).then((route: Route) => {
            routeService.addRoute(route);
        })
    }

    // Remove objects
    const locationToRemove = locationService.getlocationByID(stepToRemove.id)
    mapService.removeMarker(locationToRemove!.marker)
    location.removeLocation(stepID);
    removeStep(stepID);


    // Reindex arrays
    locationService.reindex()
    routeService.reindex()
};

const reindex = () => {
    state.steps.filter((step: Step) => step)
}


export default {
    state: readonly(state),
    addStep,
    updateStep,
    removeStep,
    removeStop,
    reindex
}