<template>
  <div>
    <div class="text-light">
      <h4>Users</h4>
      <ul class="nav flex-column">
        <li v-for="user in users" :key="user.uid">
          <span>
            <img :src="user.avatar" alt="profile"
            :class="{'rounded-circle border border-success':isOnline(user),'rounded-circle border border-secondary': !isOnline(user) }"
            height="20">
            <span :class="{'text-success': isOnline(user), 'text-secondary': !isOnline(user)}">{{ user.name }}</span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  name: "user",
  data()
  {
    return {
      users: [],
      usersRef: firebase.database().ref('users'),
      connectedRef: firebase.database().ref('.info/connected'),
      presenceRef: firebase.database().ref('presence')
    }
  },
  computed: {
    ...mapGetters(['currentUser'])
  },
  methods: {
    addListeners()
    {
      //fetch data ***********
      this.usersRef.on('child_added', (snapshot) => {
        if(this.currentUser.uid !== snapshot.key)
        {
          let user = snapshot.val()
          user['uid'] = snapshot.key
          user['status'] = 'offline'
          this.users.push(user)
        }
      })

      this.presenceRef.on('child_added', snapshot => {
        if(this.currentUser.uid !== snapshot.key)
        {
          this.addStatusToUser(snapshot.key)
        }
      })
      // remove this.users[index].status
      this.presenceRef.on('child_removed', snapshot => {
        if(this.currentUser.uid !== snapshot.key)
        {
          this.addStatusToUser(snapshot.key, false)
        }
      })

      this.connectedRef.on('value', snapshot => {  // return connected to every to our application
        //console.log('test',snapshot)
        if(snapshot.val() === true)
        {
          let ref = this.presenceRef.child(this.currentUser.uid)
          ref.set(true)
          ref.onDisconnect().remove()
        }
      })

    },
    //add user status online / offline
    addStatusToUser(userId, connected = true)
    {
      let index = this.users.findIndex(user => user.uid === userId)
      if(index !== -1)
      {
        connected === true ? this.users[index].status = 'online' : this.users[index].status = 'offline'
      }
    },
    // is user online or offline
    isOnline(user)
    {
      return user.status == 'online'
    },
    detachListeners()
    {
      this.usersRef.off()
      this.presenceRef.off()
      this.connectedRef.off()
    }
  },
  mounted()
  {
    this.addListeners()
  },
  beforeDestroy()
  {
    this.detachListeners()
  }
}
</script>
