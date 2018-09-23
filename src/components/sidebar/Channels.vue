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
        {{ channel.name }}
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
export default {
  name: 'channels',

  computed: {
    ...mapGetters(['currentChannel']),
    hasError()
    {
      return this.errors.length > 0
    }
  },

  data()
  {
    return {
      new_channel: '',
      channel: null,
      channels: [],
      errors: [],
      channelsRef: firebase.database().ref('channels') // ref in table in database firebase
    }
  },

  methods: {
    openModal()
    {
      $('#channelModal').appendTo("body").modal('show')
    },
    addChannel()
    {
      this.errors = []
      let key = this.channelsRef.push().key // random key
      console.log('new key: ', key);
      let newChannel = {id:key, name: this.new_channel} //mininum info needed to create a new channel
      this.channelsRef.child(key).update(newChannel)  //insert data
      .then(() => {

        this.new_channel = ''
        $('#channelModal').modal('hide')

      }).catch( err => this.errors.push(err.message))
    },
    setActiveChannel(channel)
    {
      return channel.id === this.currentChannel.id
    },
    changeChannel(channel)
    {
      this.$store.dispatch("setCurrentChannelAct", channel)
    },
    addListeners()
    {
      //fetch data
      this.channelsRef.on('child_added', snapshot => {
        //console.log('listening chanelsRef on child_added:', snapshot.val())
        this.channels.push(snapshot.val())

        if(this.channels.length > 0)  //set current channel
        {
          this.channel = this.channels[0] // set the first one as current channel
          this.$store.dispatch("setCurrentChannelAct", this.channel) // dispath current channel to store
        }
      })
    },
    detachListeners()
    {
      this.channelsRef.off()
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
