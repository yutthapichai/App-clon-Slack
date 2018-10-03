<template>
  <div>
    <div class="messageform">

      <!-- file upload progress bar -->
      <div class="progress" v-if="uploadState !== null">
        <div role="progressbar" class="progress-bar progress-bar-striped progress-bar-animated">
          {{ uploadLabel }}
        </div>
      </div>

      <form @submit.prevent="sendMessage">
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
              <button @click.prevent="openFileModal" :disabled="uploadState == 'uploading'" class="btn btn-secondary mt-3" type="button">Upload</button>
            </div>
        </div>
      </form>
      <!-- file upload -->
      <FileModal ref="filemodal" />
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import FileModal from './FileModal'
import uuidV4 from 'uuid/V4'
import storage from 'firebase/storage'
export default {
  name: 'message-form',
  components: { FileModal },
  data()
  {
    return {
      message: '',
      errors: [],
      storageRef: firebase.storage().ref(),
      uploadTask: null,
      uploadState: null
    }
  },

  computed: {
    ...mapGetters(['currentChannel', 'currentUser', 'isPrivate']),

    // upload state show on progress bar
    uploadLabel(){
      switch(this.uploadState){
        case 'uploading': return 'Uploading in progress'
          break
        case 'error': return 'Error occured'
          break
        case 'done': return 'Upload completed'
          break
        default: return ''
      }
    }
  },

  methods: {
    sendMessage(){
      //construct new message object
      // use some validate
      if(this.currentChannel !== null){
        if(this.message.length > 0){
          // insert style object**************************
          this.$parent.getMessagesRef().child(this.currentChannel.id).push().set(this.createMessage())
          .then(() => {
            // scoll message up or down
            this.$nextTick(() => {
              $("html, body").scrollTop($(document).height())
            })
          }).catch(err => {
            this.errors.push(err.message)
            //console.log(err)
          })
          this.message = ''
        }
      }
    },
    createMessage(fileUrl = null){
      let messages = {
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: {
          name: this.currentUser.displayName,
          avatar: this.currentUser.photoURL,
          id: this.currentUser.uid
        }
      }

      if(fileUrl == null){
        // either send message with content
        messages['chat'] = this.message
      }else {
        // or send the message with image
        messages['image'] = fileUrl
      }

      return messages
    },
    uploadFile(file, metadata){
      // console.log('file :',file, 'meta :', metadata)
      if(file === null) return false
      let pathToupload = this.currentChannel.id
      let ref = this.$parent.getMessagesRef()
      let filePath = this.getPath() + '/' + uuidV4() + '.jpg'
      // insert file to storage firebase
      this.uploadTask = this.storageRef.child(filePath).put(file, metadata)
      this.uploadState = "uploading"

      this.uploadTask.on('state_changed', snapshot => {
        // upload in progress
        let percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        $(".progress-bar").css("width", percent + '%')
      }, error => { // paramitor 2
        // error
        this.errors.push(error.message)
        this.uploadState = 'error'
        this.uploadTask = null
        // reset form by $refs refer from name 'filemodal' call function resetForm
        this.$refs.filemodal.resetForm()
      }, () => {  // paramitor 3
        // upload finished
        this.uploadState = 'done'
        // reset form by $refs refer from name 'filemodal' call function resetForm
        this.$refs.filemodal.resetForm()
        // fetch url image from file storage firebase
        let fileUrl = this.uploadTask.snapshot.ref.getDownloadURL().then(fileUrl => {
          this.sendFileMessage(fileUrl, ref, pathToupload)
          //console.log('finished upload file :', fileUrl)
        })
      })
    },
    sendFileMessage(fileUrl, ref, pathToupload){
      // pathToupload is channel id at table private or channel message
      // insert file to database firebase
      ref.child(pathToupload).push().set(this.createMessage(fileUrl)).then(() => {
        this.uploadState = null // hide tab bar progress image
        this.$nextTick(() => {
          $("html, body").scrollTop($(document).height())
        })
      }).catch(error => {
        this.errors.push(error.message)
      })
    },
    // folder direct to store file
    getPath()
    {
      if(this.isPrivate)
      {
        return 'chat/private/' + this.currentChannel.id
      } else {
        return 'chat/public'
      }
    },

    openFileModal()
    {
      $("#fileModal").appendTo("body").modal('show')
      console.log('openFileModel')
    },
    mounted()
    {
      $("html, body").scrollTop($(document).height())
    },
    beforeDestroy()
    {
      if(this.uploadTask !== null){
        this.uploadTask.cancel()
        this.uploadTask = null
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

  .progress
  {
    margin-bottom: -16px;
  }
</style>
