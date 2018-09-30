<template>
  <div>
    <div class="mt-3 mb-5">
      <div v-for="(message, key) in messages" :key="key">
        <div class="media">
          <img :src="message.user.avatar" alt="avatar" height="50" class="align-self-start mr-3">

          <div class="media-body">
            <h6 class="mt-0">
              <a href="#" class="text-info">{{ message.user.name }}</a> - <small class="text-muted">{{ message.timestamp | fromNow }}</small>
            </h6>
            <p v-if="!isFile(message)" :class="{'self_message': selfMessage(message.user)}">{{ message.chat }}</p>

            <img v-else :src="message.image" height="200" alt="image" class="img img-responsive">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment' // แปลงเวลาวินาที เป็น เวลามนุษย์
import { mapGetters } from 'vuex'

export default {
  name: 'single-message',
  props: ['messages'],
  computed: {
    ...mapGetters(['currentUser'])
  },
  methods: {
    selfMessage(user)
    {
      return user.id === this.currentUser.uid
    },
    isFile(message){
      return message.content == null && message.image != null
    }
  },
  filters: {
    fromNow(value)
    {
      return moment(value).fromNow()
    }
  }
}
</script>
<style>
.self_message
{
  border-left: 5px solid rgb(137, 224, 195);
  padding: 0 10px
}
.text-blue
{
  color:#0c5460;
}
</style>
