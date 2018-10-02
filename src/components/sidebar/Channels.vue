<template>
  <div>
    <!-- Button trigger modal -->
    <button @click="openModal" type="button" class="btn btn-outline-light btn-block">
      Add channel
    </button>

    <div class="mt-3">
      <button v-for="channel in channels" :key="channel.id"
      class="list-group-item-info list-group-item list-group-item-action"
      :class="{ 'active': setActiveChannel(channel)}"
      @click="changeChannel(channel)"
      type="button">
        {{ channel.name }} <span v-if="getNotification(channel) > 0 && channel.id !== currentChannel.id" class="float-right">{{ getNotification(channel) }}</span>
      </button>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="channelModal">
      <div class="modal-dialog model-dailog-centerd" role="document">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title text-info">Modal Channel</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <form action="">
              <div class="form-group">
                <input v-model="new_channel" type="text" id="channel" name="channel" placeholder="Enter channel name" class="form-control">
              </div>
              <!-- errors -->
              <ul class="list-group" v-if="hasError">
                <li class="list-group-item text-danger" v-for="error in errors" :key="error">{{ error }}</li>
              </ul>
            </form>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button @click="addChannel" type="button" class="btn btn-info">Add channel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import database from 'firebase/database'
import { mapGetters} from 'vuex'
import mixin from '../../mixins.js'
export default {
  name: 'channels',

  computed: {
    ...mapGetters(['currentChannel', 'isPrivate']),
    hasError()
    {
      return this.errors.length > 0
    }
  },
  watch: {
    isPrivate(){
      if(this.isPrivate) this.resetNotifications()
    }
  },
  mixins: [mixin],
  data()
  {
    return {
      new_channel: '',
      notifCount: [],
      channel: null,
      channels: [],
      errors: [],
      messagesRef: firebase.database().ref('messages'),
      channelsRef: firebase.database().ref('channels') // ref in table in database firebase
    }
  },

  methods: {
    openModal(){
      $('#channelModal').appendTo("body").modal('show')
    },
    addChannel(){
      this.errors = []
      let key = this.channelsRef.push().key // random key
      console.log('new key: ', key);
      let newChannel = {id:key, name: this.new_channel} //mininum info needed to create a new channel
      this.channelsRef.child(key).update(newChannel)  //insert data ******************
      .then(() => {

        this.new_channel = ''
        $('#channelModal').modal('hide')

      }).catch( err => this.errors.push(err.message))
    },
    setActiveChannel(channel){
      return channel.id === this.currentChannel.id
    },
    changeChannel(channel){
      // reset notifications
      this.resetNotifications()
      this.$store.dispatch('setPrivateAct', false)
      this.$store.dispatch("setCurrentChannelAct", channel)
      // set channel
      this.channel = channel
    },
    resetNotifications(){
      let index = this.notifCount.findIndex(el => el.id === this.channel.id)
      if(index !== -1){
        this.notifCount[index].total = this.notifCount[index].lastKnowTotal
        this.notifCount[index].notif = 0
      }
    },
    addListeners(){
      //fetch data *****************
      this.channelsRef.on('child_added', snapshot => {
        //console.log('listening chanelsRef on child_added:', snapshot.val())
        this.channels.push(snapshot.val())

        if(this.channels.length > 0)  //set current channel
        {
          this.channel = this.channels[0] // set the first one as current channel
          this.$store.dispatch("setCurrentChannelAct", this.channel) // dispath current channel to store
        }
        //add count listener to manage the notifications
        this.addCountListener(snapshot.key) // show key channels
      })
    },
    getNotification(channel){
      let notif = 0
      this.notifCount.forEach(el => {
        if(el.id === channel.id){
          notif = el.notif
        }
      })
      return notif
    },

    addCountListener(channelId){
      this.messagesRef.child(channelId).on('value', snapshot => {
        this.handleNotifications(channelId, this.currentChannel.id, this.notifCount, snapshot)
      })
    },
/*     handleNotifications(channelId, currentChannelId, notifCount, snapshot){
      let lastTotal = 0
      // find if channelId is already added to notifCount[]
      let index = notifCount.findIndex(el => el.id === channelId)
      // if found
      if(index != -1){
        if(channelId !== currentChannelId){
          lastTotal = notifCount[index].total

          if(snapshot.numChildren() - lastTotal > 0){
            notifCount[index].notif = snapshot.numChildren() - lastTotal
          }
        }
        notifCount[index].lastKnowTotal = snapshot.numChildren()
      }else {
        // push to notifCount[]
        notifCount.push({
          id: channelId,
          total: snapshot.numChildren(),
          lastKnowTotal: snapshot.numChildren(),
          notif: 0
        })
      }
    }, */
    detachListeners(){
      this.channelsRef.off()
      this.channels.forEach(el => {
        this.messagesRef.child(el.id).off()
      })
    }
  },

  mounted()  //work auto when open this page
  {
    this.addListeners()
  },

  beforeDestroy()
  {
    this.detachListeners()
  }
}
</script>
