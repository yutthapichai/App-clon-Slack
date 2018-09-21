import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// create state that hold data
const state = {
  currentUser: null
}

// update state data though mutation
const mutations = {
  SET_USER_Mu: (state, user) => {
    state.currentUser = user
  }
}

// create actions for mutation with necessary data
const actions = {
  setUser_Act: (state , user) => {
    state.commit('SET_USER_Mu', user)
  }
}

// get data from state
const getters = {
  // this is function
  currentUser: state => state.currentUser
}

//create vuex store or export default store from const store =
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})


