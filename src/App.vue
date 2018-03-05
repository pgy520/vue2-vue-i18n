<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <v-navbar></v-navbar>
    <router-view/>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue"
import $ from "jquery"
export default {
  name: 'App',
  components:{
    "v-navbar":Navbar
  },
  mounted(){
     $(document).ready(function(){
        $('html').attr('lang',LAN)
    })
  }
}
</script>

<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
