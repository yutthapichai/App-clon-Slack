export default {
  methods: {
    handleNotifications(channelId, currentChannelId, notifCount, snapshot) {
      let lastTotal = 0
      // find if channelId is already added to notifCount[]
      let index = notifCount.findIndex(el => el.id === channelId)
      console.log("channelId :", index);
      console.log("notifCount :", notifCount);
      // if found has not == -1
      if (index != -1) {
        if (channelId !== currentChannelId) {
          lastTotal = notifCount[index].total

          if (snapshot.numChildren() - lastTotal > 0) {
            notifCount[index].notif = snapshot.numChildren() - lastTotal
          }
        }
        notifCount[index].lastKnowTotal = snapshot.numChildren() // จำนวนข้อความทั้งหมด
      } else {
        // push to notifCount[]
        notifCount.push({
          id: channelId,
          total: snapshot.numChildren(),
          lastKnowTotal: snapshot.numChildren(),
          notif: 0
        })
      }
    }
  }
}
