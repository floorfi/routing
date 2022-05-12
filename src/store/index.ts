import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
  state: {
    locations: [] as any[],
    routeTo: [] as object[]
  },
  mutations: {
    addLocation (state, location) {
      state.locations.push(location)
      console.log(state.locations)

    },

    removeLocation (state, id) {
      state.locations = state.locations.filter(location => {
        return location.id !== id
      })
      console.log(state.locations)

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