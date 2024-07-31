<template>
  <Navbar @click="FlashWidnow()" />
  <main>
    <Lefbar id="Left" />
    <VtkWindow ref="son" id="Screen" />
  </main>
  <Foobar id="Foot" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from './NavBar.vue'
import Foobar from './Footer.vue'
import Lefbar from './LeftBar.vue'
import VtkWindow from './components/VtkWindow.vue'

const son = ref();
let FlashWidnow = ref(null)
onMounted(() => {
  FlashWidnow = () => {
    // console.log(son.value.msg);
    console.log(son.value.fullScreenRenderer);
    son.value.fullScreenRenderer.getRenderer().resetCamera()
    son.value.fullScreenRenderer.getRenderWindow().render()
    // son.value.reatemode
  }
})
</script>


<style scoped>
#Foot {
  background-color: #295b89;
  height: 47px;
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

#Screen {
  flex: 1;
  /* height: calc(100vh - 47px - 47px - 116px); */
}
</style>
