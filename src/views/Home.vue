<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from '../components/HelloWorld.vue';
import NavBar from '../components/NavBar.vue';
</script>

<template>
  <NavBar class="w-screen" />
  <div class="w-full flex flex-col items-center pt-32">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Hello vue" />
  </div>
</template>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
