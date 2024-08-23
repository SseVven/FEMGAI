<template>
  <Navbar @click="FlashWidnow()" />
  <main>
    <Lefbar id="Left" />
    <VtkWindow id="Screen" style="flex: 1;" />
  </main>
  <Foobar id="Foot" />
</template>

<script setup>
import Navbar from './NavBar.vue'
import Foobar from './Footer.vue'
import Lefbar from './LeftBar.vue'
import VtkWindow from './components/VtkWindow.vue'
</script>


<style scoped>
#Foot {
  background-color: #295b89;
  height: 30px;
}

main {
  flex: 1;
  display: flex;
  height: 0;
  width: 100%;
  overflow: hidden;
  flex-direction: row;
  background-color: #ccc;
  border-top: 1px solid #295b89;
  padding: 7px;
}

#Left {
  width: 400px;
  /* resize: horizontal; */
  /* overflow: hidden; */
}
</style>
