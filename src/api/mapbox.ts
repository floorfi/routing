import axios, {AxiosInstance} from "axios";

const apiClient: AxiosInstance = axios.create({
  headers: {
    "Content-type": "application/json",
  }
});

class MapBoxDataService {
  getSearchResults(query: string): Promise<any> {
    return apiClient.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + query + '.json?language=de&access_token=' + process.env.VUE_APP_API_KEY);
  }

  getRoute(coords: [number[]]): Promise<any> {
    if(coords.length <= 1) {
      return Promise.resolve();
    }
    let coordString = '';
    coords.forEach(coordinateSet => {
      coordString += coordinateSet[0] + ',' + coordinateSet[1] + ';'
    });
    coordString = coordString.slice(0,-1);

    return apiClient.get('https://api.mapbox.com/directions/v5/mapbox/driving/' + coordString + '?geometries=geojson&access_token=' + process.env.VUE_APP_API_KEY);
  }

}
export default new MapBoxDataService();