import {Route} from "@/models/route.model";
import {Location} from "@/models/location.model";

export interface Step {
    id: string;
    orderID: number;
    location: Location;
    routeTo?: Route;
}