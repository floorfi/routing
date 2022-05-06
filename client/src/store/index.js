import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
  state: {
    locations: []
  },
  mutations: {
    addLocation (state, location) {
      state.locations.push(location)
    }
  }
})

export default store;