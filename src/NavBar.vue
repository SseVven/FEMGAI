<script setup>
const name_en = ["File", "Sketch", "Design", "Display", "Assembly", "Measure", "Facets", "Repair", "Prepare", "Workbench", "Detail", "Sheet_Metal", "Tools", "KeyShot"];
const name_zh = ["文件", "草图", "设计", "展示", "装配", "测量", "平面", "修复", "预处理", "工作台", "详细", "金属薄板", "工具", "渲染"];
const MenuBar = []
for (let i = 0; i < name_en.length; i++) {
  MenuBar.push({
    name_en: name_en[i],
    name_zh: name_zh[i],
    id: "nav-" + name_en[i] + "-tab",
    target: "#nav-" + name_en[i],
    controls: "nav-" + name_en[i],
  })
}
</script>

<template>
  <nav>
    <div class=" nav_left">
      <a class="logo" @click=" count++;">
        <img src="./assets/logo.svg" alt="SVG Image" height="100%">
      </a>
    </div>

    <div class="nav_mid nav nav-tabs" id="nav-tab" role="tablist">
      <button v-for="item in MenuBar" :key="item.name_en"
        :class="item.name_en == 'File' ? 'nav-link active' : 'nav-link'" :id="item.id" data-bs-toggle="tab"
        :data-bs-target="item.target" type="button" role="tab" :aria-controls="item.controls" aria-selected="false">
        {{ item.name_zh }}</button>
    </div>

    <div class=" nav_right"></div>
  </nav>

  <section class="tab-content" id="nav-tabContent">
    <div v-for="item in MenuBar" :key="item.name_en"
      :class="item.name_en == 'File' ? 'tab-pane fade active show' : 'tab-pane fade'" :id="item.controls"
      role="tabpanel" :aria-labelledby="item.id" tabindex="0">{{ item.name_en }}</div>
  </section>
</template>


<style scoped>
nav {
  height: 47px;
  padding: 3px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  background-color: #193854;
}
section{
  height: 116px;
}
.nav_mid {
  flex: auto;
}

.logo {
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  cursor: pointer;
}
</style>
