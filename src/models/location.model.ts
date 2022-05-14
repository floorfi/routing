import {Coords} from "@/models/coords.model";
// @ts-ignore
import {Marker} from "mapbox-gl";

export interface Location {
    id: string;
    label: string;
    coords: Coords;
    marker: Marker;
}