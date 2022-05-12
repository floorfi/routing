import {Coords} from "@/models/coords.model";

export interface Route {
    id: string;
    travelTime: number;
    waypoints: Coords[];
}