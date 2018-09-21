<template>
  <div>
    <div class="jumbotron bg-danger text-white text-center">
      <h2 class="lead display-3">
        App clon Slack
      </h2>
      <p>Realtime comunition at it's best</p>
    </div>
    <!-- show loading status -->
    <div class="alert alert-info" v-if="loading">Loading...</div>
    <!-- show errors -->
    <div class="alert alert-danger" v-if="hasErrors">
      <div v-for="error in errors" :key="error">{{ error }}</div>
    </div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 text-center mt-3">
          <button @click="loginWithGoogle" class="btn btn-outline-danger btn-lg">Login with google</button>
        </div>
        <div class="col-12 text-center mt-3">
          <button class="btn btn-outline-info btn-lg">Login with Twitter</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from 'firebase/auth'
export default {
  name: 'login',
  data(){
    return {
      errors: [],
      loading: false
    }
  },
  computed: {
    hasErrors(){
      return this.errors.length > 0
    }
  },
  methods: {
    loginWithGoogle() {
      // if true will show alert
      this.loading = true
      this.errors = []

      firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(res => {
        // console.log(res.user)
        this.loading = false
        // dispatch setUser action
        this.$store.dispatch('setUser_Act', res.user)
        // then redirect user to /
        this.$router.push('/')
      })
      .catch(err => {
        this.errors.push(err.message)
        this.loading = false
      })
    }
  }
}
</script>
