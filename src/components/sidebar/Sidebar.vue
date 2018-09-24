<template>
    <div>
        <h2 class="text-light">My Chat</h2>

        <span>
          <img :src="currentUser.photoURL" alt="photo" height="30" class="rounded-circle mt-2">
          <span class="text-light">{{ currentUser.displayName }}</span>
        </span>
        <button @click="logout" class="btn btn-outline-light float-right">Logout</button>

        <hr style="border: 0.5px solid;" class="text-light">
        <Channels />

        <hr style="border: 0.5px solid;" class="text-light">
        <Users />

    </div>
</template>

<script>
import auth from 'firebase/auth'
import { mapGetters } from 'vuex'
import Channels from './Channels'
import Users from './Users'
import database from 'firebase/database'
export default {
  name: 'sidebar',
  components: { Channels, Users },
  data()
  {
    return {
      presenceRef: firebase.database().ref('presence')
    }
  },
  computed:{
    ...mapGetters(['currentUser'])
  },
  methods: {
    logout() {
      // delete data on database********************
      this.presenceRef.child(this.currentUser.uid).remove()
      firebase.auth().signOut()
      this.$store.dispatch('setUser_Act', null)
      this.$router.push('/login')
    }
  }
}
</script>
