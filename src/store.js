import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// create state that hold data
const state = {
  currentUser: null,
  currentChannel: null
}

// update state data though mutation
const mutations = {

  SET_USER_MU :(state, user) => state.currentUser = user,
  SET_CURRENT_CHANNEL_MU: (state,channel) => state.currentChannel = channel

}

// create actions for mutation with necessary data
const actions = {

  setUser_Act: (state , user) => state.commit('SET_USER_MU', user),
  setCurrentChannelAct: ({commit}, channel) => commit('SET_CURRENT_CHANNEL_MU', channel)

}

// get data from state
const getters = {
  // this is function
  currentUser: state => state.currentUser,
  currentChannel: state => state.currentChannel

}

//create vuex store or export default store from const store =
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})


