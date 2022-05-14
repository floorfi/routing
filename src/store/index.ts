import { createStore } from 'vuex'
import {Step} from "@/models/step.model";
import {Location} from "@/models/location.model";
import {Route} from "@/models/route.model";
import {inject} from "vue";

// Create a new store instance.
const store = createStore({
  state: {
    step: [] as Step[],
    location: [] as Location[],
    routeTo: [] as Route[]
  },
  actions: {

  },
  mutations: {
    addStep (state, step: Step) {
      state.step.push(step)
    },

    addLocation (state, location: Location) {
      state.location.push(location)
    },

    addRoute (state, route: Route) {
      state.routeTo.push(route);
    },

    removeStep (state, id: string) {
      state.step = state.step.filter(step => {
        return step.id !== id
      })
    },

    removeLocation (state, id: string) {
      state.location = state.location.filter(location => {
        return location.id !== id
      })
    },

    removeRoute (state, id: string) {
      state.routeTo = state.routeTo.filter(route => {
        return route.id !== id
      })
    },
  }
})

export default store;