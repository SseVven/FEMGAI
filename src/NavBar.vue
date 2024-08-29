<script setup>
import ToolsBar from './components/NavBar/ToolsBar.vue'
import EventBus from './assets/common/event-bus';
import MenuBar from './assets/common/NavBar';

// 点击工具 val: ["File", "保存"]
const HandleClick = (val) => {
  EventBus.emit("tool-click", val);
}
</script>

<template>
  <nav>
    <div class="nav_left">
      <a class="logo" @click=" count++;">
        <img src="./assets/logo.svg" alt="SVG Image" height="100%">
      </a>
    </div>
    <!-- 导航栏 -->
    <div class="nav_mid nav nav-tabs" id="nav-tab" role="tablist">
      <button v-for="item in MenuBar" :key="item.name_en"
        :class="item.name_en == 'Model' ? 'nav-link active' : 'nav-link'" :id="item.id" data-bs-toggle="tab"
        :data-bs-target="item.target" type="button" role="tab" :aria-controls="item.controls" aria-selected="false">
        {{ item.name_zh }}</button>
    </div>

    <div class="nav_right"></div>
  </nav>
  <!-- 菜单工具 -->
  <section class="tab-content" id="nav-tabContent">
    <div v-for="item in MenuBar" :key="item.name_en"
      :class="item.name_en == 'Model' ? 'tab-pane fade active show' : 'tab-pane fade'" :id="item.controls"
      style="height: 100%;" role="tabpanel" :aria-labelledby="item.id" tabindex="0">
      <ToolsBar :name="item.name_en" :tool-modules="item.toolModules" @click="HandleClick" />
    </div>
  </section>
</template>


<style scoped>
nav {
  height: 47px;
  padding: 3px 3px 0;
  display: flex;
  flex-direction: row;
  gap: 10px;
  background-color: #295b89;
}

section {
  background-color: #f1f1f1;
  height: 116px;
  padding: 0;
}

.nav_right {
  flex: auto;
}

.logo {
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  cursor: pointer;
}

button {
  color: #fff;
}

button:hover {
  color: #fff;
}
</style>
