
<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <Planer />
</template>

<script lang="ts">
// npm install -g @vue/cli
// "npm run serve" to run
import { defineComponent } from 'vue';
import Planer from './components/Sitzplatzplaner.vue';

export default defineComponent({
  name: 'App',
  components: {
    Planer
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
}

body{
  margin-left:0;
}
</style>
