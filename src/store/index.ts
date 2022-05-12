import { createStore } from 'vuex'
import {Step} from "@/models/step.model";
import {Location} from "@/models/location.model";
import {Route} from "@/models/route.model";

// Create a new store instance.
const store = createStore({
  state: {
    step: [] as Step[],
    location: [] as Location[],
    routeTo: [] as Route[]
  },
  mutations: {
    addLocation (state, location: Location) {
      state.location.push(location)
      console.log(state.location)

    },

    removeLocation (state, id) {
      state.location = state.location.filter(location => {
        return location.id !== id
      })
      console.log(state.location)

    },

    // addRouteTo (state, route) {
    //   state.routeTo.push(route)
    //   console.log(state.routeTo)

    // },

    // removeRouteTo (state, id) {
    //   state.routeTo = state.routeTo.filter(route => {
    //     return route.id !== id
    //   })
    //   console.log(state.routeTo)
    // }
  }
})

export default store;