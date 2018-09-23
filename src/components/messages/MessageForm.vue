<template>
  <div>
    <div class="messageform">
      <form>
        <div class="input-group mb-3">
          <input v-model.trim="message" type="text"
          class="form-control mt-3 bg-light border border-info" autofocus
          name="message" id="message"
          placeholder="Write something"
          >
           <div class="input-group-append">
              <button @click="sendMessage" class="btn btn-info mt-3" type="button">Send</button>
            </div>

            <div class="input-group-append">
              <button class="btn btn-secondary mt-3" type="button">Upload</button>
            </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  name: 'message-form',

  data()
  {
    return {
      message: '',
      errors: []
    }
  },

  computed: {
    ...mapGetters(['currentChannel', 'currentUser'])
  },

  methods: {
    sendMessage()
    {
      //construct new message object
      let newMessage = {
        chat: this.message,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: {
          name: this.currentUser.displayName,
          avatar: this.currentUser.photoURL,
          id: this.currentUser.uid
        }
      }
      if(this.currentChannel !== null)
      {
        if(this.message.length > 0)
        { // insert style object
          this.$parent.messagesRef.child(this.currentChannel.id).push().set(newMessage)
          .then(() => {
            //
          })
          .catch(err => {
            this.errors.push(err.message)
            //console.log(err)
          })
          this.message = ''
        }
      }
    }
  }
}
</script>
<style scoped>
  .messageform
  {
    position: fixed;
    left: 0;
    bottom:0;
    width:67%;
    z-index:100;
    color:rgb(255, 255, 255);
    text-align: center;
    margin-bottom: -16px;
    margin-left: 33.3%;
  }
</style>
