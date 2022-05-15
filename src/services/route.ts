import {Route} from "@/models/route.model";
import {Location} from "@/models/location.model";
import {Coords} from "@/models/coords.model";
import MapBoxDataService from "@/api/mapbox";
import {reactive, readonly} from "vue";
import map from "./map"
import {Step} from "@/models/step.model";

const state = reactive({
    routes: [] as Route[]
})

const getRoute = (locationA: Location, locationB: Location): Promise<Route> => {
    const coords: Coords[] = [];
    coords.push(locationA.coords)
    coords.push(locationB.coords)

    return new Promise(resolve => {
        MapBoxDataService.getRoute(coords)
            .then(response => {
                console.log(response)
                const data = response.data.routes[0];
                const route = data.geometry.coordinates;
                const geojson = map.buildFeature('LineString', route);

                map.addLayerRoute(locationB.id, geojson)

                resolve(
                    {
                        id: locationB.id,
                        travelTime: data.duration,
                        waypoints: route
                    }
                )
            });
    })
}

const addRoute = (route: Route) => {
    state.routes.push(route);
}

const removeRoute = (id: string) => {
    state.routes = state.routes.filter((route: Route) => {
        return route.id !== id
    })
}

const getRouteByID = (id: string): Route|undefined => {
    return state.routes.find(route => route.id === id)
}

const reindex = () => {
    state.routes.filter((route: Route) => route)
}

export default {
    state: readonly(state),
    addRoute,
    removeRoute,
    getRoute,
    getRouteByID,
    reindex
}