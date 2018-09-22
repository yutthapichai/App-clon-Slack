<template>
    <div>
        <h2 class="text-light">My Chat</h2>

        <span>
          <img :src="currentUser.photoURL" alt="photo" height="30" class="rounded-circle mt-2">
          <span class="text-light">{{ currentUser.displayName }}</span>
        </span>
        <hr style="order: 1px solid #333;">

        <button @click="logout" class="btn btn-outline-light">Logout</button>
    </div>
</template>

<script>
import auth from 'firebase/auth'
import { mapGetters } from 'vuex'
export default {
  name: 'sidebar',
  computed:{
    ...mapGetters(['currentUser'])
  },
  methods: {
    logout() {
      firebase.auth().signOut()
      this.$store.dispatch('setUser_Act', null)
      this.$router.push('/login')
    }
  }
}
</script>
