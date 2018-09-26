<template>
  <div>
    <Singlemessage :messages="messages" />
    <message-form />
  </div>
</template>
<script>
import Singlemessage from './SingleMessage'
import MessageForm from './MessageForm'
import database from 'firebase/database'
import {mapGetters} from 'vuex'
export default {
  name: 'messages',
  components: {
    Singlemessage, MessageForm
  },
  data()
  {
    return {
      messagesRef: firebase.database().ref('messages'),
      privateMessagesRef: firebase.database().ref('privateMessages'),
      messages: [],
      channel: null,
      listener: []
    }
  },
  computed: {
    ...mapGetters(['currentChannel', 'currentUser', 'isPrivate'])
  },

  watch: {
    currentChannel()
    {
      this.messages = []
      this.addListeners()
      this.channel = this.currentChannel
    }
  },

  methods: {
    addListeners()
    {
      // fetch data*************************************
      let ref = this.getMessagesRef()
      ref.child(this.currentChannel.id).on('child_added',(snapshot) => {

        let message = snapshot.val()

        message['id'] = snapshot.key
        console.log(snapshot.key)
        this.messages.push(message)
        // scoll message up or down
        this.$nextTick(() => {
          $("html, body").scrollTop($(document).height())
        })
      })
    },
    detachListeners()
    {
      if(this.channel !== null)
      {
        this.messagesRef.child(this.channel.id).off()
      }
    },
    getMessagesRef()
    {
      if(this.isPrivate)
      {
        return this.privateMessagesRef
      } else {
        return this.messagesRef
      }
    }
  },
  beforeDestroy()
  {
    this.detachListeners()
  }
}
</script>
