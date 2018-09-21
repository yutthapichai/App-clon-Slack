// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase/app'
import store from './store'

Vue.config.productionTip = false;


// Initialize Firebase
var config = {
  apiKey: 'AIzaSyBK9k1DzpfsF2hqo8j7Vfc5uuSaxvHFeSU',
  authDomain: 'vueclonslack.firebaseapp.com',
  databaseURL: 'https://vueclonslack.firebaseio.com',
  projectId: 'vueclonslack',
  storageBucket: 'vueclonslack.appspot.com',
  messagingSenderId: '123113339769'
};
firebase.initializeApp(config);

window.firebase = firebase;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

