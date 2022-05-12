import axios from "axios";

class MapBoxDataService {
  getSearchResults(query: string): Promise<any> {
    return axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + query + '.json?language=de&access_token=' + process.env.VUE_APP_API_KEY);
  }

}
export default new MapBoxDataService();