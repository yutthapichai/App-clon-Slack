<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-4 sidebar">
          <Sidebar />
        </div>
        <div class="col-md-8 content">
          content
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Sidebar from '../components/sidebar/sidebar'

export default {
    name: 'chat',
    components: { Sidebar }
}
</script>

<style scoped>
  .sidebar
  {
    width:33.5%;
    display: block;
    float:left;
    position: fixed;
    height: 100%;
    background: rgb(137, 224, 195);
    padding-top:2em;
    overflow: auto;
  }
  .content
  {
    width:66%;
    display:block;
    float: left;
    margin-left:33%;
  }
</style>
