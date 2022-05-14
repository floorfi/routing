import {ref, computed, getCurrentInstance} from "vue";
import {Coords} from "@/models/coords.model";
import MapBoxDataService from "@/api/mapbox";
import {Location} from "@/models/location.model";
// @ts-ignore
import mapboxgl from "mapbox-gl";

export default function () {

    const map = getCurrentInstance()!.appContext.config.globalProperties.$map;

    const getRoute = (locationA: Location, locationB: Location) => {
        const coords: Coords[] = [];
        coords.push(locationA.coords)
        coords.push(locationB.coords)

        return new Promise(resolve => {
            MapBoxDataService.getRoute(coords)
                .then(response => {
                    console.log(response)
                    const data = response.data.routes[0];
                    const route = data.geometry.coordinates;
                    const geojson = buildFeature('LineString', route);
                    // if the route already exists on the map, we'll reset it using setData
                    console.log(map);

                    if (map.getSource('route')) {
                        map.getSource('route').setData(geojson);
                    }
                    // otherwise, we'll make a new request
                    else {
                        addLayerRoute('route', geojson);
                    }

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

    const addLayerRoute = (id: string, geojson: object) => {
        return map.addLayer({
            'id': id,
            'type': 'line',
            'source': {
                'type': 'geojson',
                'data': geojson
            },
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#3887be',
                'line-width': 5,
                'line-opacity': 0.75
            }
        })
    }

    const buildFeature = (type: string, coords: Coords) => {
        return {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': type,
                'coordinates': convertCoordsToNumbers(coords)
            }
        }
    }

    // Mapbox Marker hinzufügen
    const addMarker = (coords: Coords) => {
        return new mapboxgl.Marker({
            color: "#FFFFFF",
            draggable: true
        }).setLngLat(convertCoordsToNumbers(coords))
            .addTo(map);
    }

    const centerMap = (coords: Coords) => {
        map.setCenter(convertCoordsToNumbers(coords));
    }

    const convertCoordsToNumbers = (coords: Coords): number[] => {
        return [coords.latitude, coords.longitude]
    }
    const convertNumbersToCoords = (coords: number[]): Coords => {
        return {
            latitude: coords[0],
            longitude: coords[1]
        }
    }

    return {
        getRoute,
        addLayerRoute,
        buildFeature,
        addMarker,
        centerMap,
        convertCoordsToNumbers,
        convertNumbersToCoords
    }
}