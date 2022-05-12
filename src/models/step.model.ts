import {Route} from "@/models/route.model";
import {Location} from "@/models/location.model";

export interface Step {
    id: string;
    location: Location;
    routeTo: Route
}