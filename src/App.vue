<template>
  <Navbar id="Nav" @click="FlashWidnow()" />
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
#Nav {
  /* height: 47px; */
}

#Foot {
  background-color: #295b89;
  height: 47px;
}

main {
  flex: 1;
  display: flex;
  flex-direction: row;
  background-color: #f1f1f1;
  border-top: 1px solid #295b89;
}

#Left {
  min-width: 400px;
  /* resize: horizontal; */
  /* overflow: hidden; */
}

#Screen {
  flex: auto;
  height: calc(100vh - 47px - 47px - 116px);
}
</style>
