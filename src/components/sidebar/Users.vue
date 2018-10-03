<template>
  <div>
    <div>
      <h4 class="text-light">Users</h4>

        <div class="mt-3">
          <button v-for="user in users" :key="user.uid"
          class="list-group-item-info list-group-item list-group-item-action"
          :class="{ 'active': isActive(user)}"
          @click.prevent="changeChannel(user)"
          type="button">

          <span :class="{'fa fa-circle text-success': isOnline(user), 'fa fa-circle text-secondary': !isOnline(user)}"></span>

          <span>
            <img :src="user.avatar" alt="profile"
            :class="{'rounded-circle border border-success':isOnline(user),'rounded-circle border border-secondary': !isOnline(user) }"
            height="20">
            <span :class="{'text-light': isActive(user)}">
              {{ user.name }} <span v-if="getNotifications(user) >= 1 " class="float-right">{{ getNotifications(user) }}</span>
              </span>
          </span>
          </button>
        </div>

    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import mixin from '../../mixins.js'
export default {
  name: "user",
  data()
  {
    return {
      users: [],
      usersRef: firebase.database().ref('users'),
      connectedRef: firebase.database().ref('.info/connected'),
      presenceRef: firebase.database().ref('presence'),
      privateMessageRef: firebase.database().ref('privateMessages'),
      notifCount: [],
      channel: null
    }
  },
  mixins:[mixin],
  computed: {
    ...mapGetters(['currentUser', 'currentChannel','isPrivate'])
  },
  watch: {
    isPrivate(){
      if(!this.isPrivate) this.resetNotifications() // note ture
    }
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

          let channelId = this.getChannelId(snapshot.key)

          this.privateMessageRef.child(channelId).on('value', snapshot => {
            this.handleNotifications(channelId, this.currentChannel.id, this.notifCount, snapshot)
          })
        }
      })
      // remove this.users[index].status
      this.presenceRef.on('child_removed', snapshot => {
        if(this.currentUser.uid !== snapshot.key)
        {
          this.addStatusToUser(snapshot.key, false)

          this.privateMessageRef.child(this.getChannelId(snapshot.key)).off()
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
    getNotifications(user){
      let channelId = this.getChannelId(user.uid)
      let notif = 0

      this.notifCount.forEach(el => {
        if(el.id === channelId) notif = el.notif
      })

      return notif
    },
    resetNotifications(user = null){
      let channelId = null

      if(user !== null) {
        channelId = this.getChannelId(user.uid)
      } else {
        channelId = this.channel.id
      }

      let index = this.notifCount.findIndex(el => el.id === channelId)
      if(index !== -1){
        this.notifCount[index].total = this.notifCount[index].lastKnowTotal
        this.notifCount[index].notif = 0
      }
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

      this.channels.forEach(el => {
        this.messagesRef.child(el.id).off()
      })
    },
    changeChannel(user)
    {
      if(this.channel === null){
        this.resetNotifications(user)
      }else {
        this.resetNotifications()
      }

      let channelId = this.getChannelId(user.uid)
      let channel = { id: channelId, name: user.name}

      this.channel = channel

      this.$store.dispatch('setPrivateAct', true)
      this.$store.dispatch('setCurrentChannelAct', channel)
    },
    isActive(user)
    {
      let channelId = this.getChannelId(user.uid)
      return this.currentChannel.id === channelId
    },
    getChannelId(userId)
    {
      return userId < this.currentUser.uid ? userId + '/' + this.currentUser.uid : this.currentUser.uid + '/' + userId
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
