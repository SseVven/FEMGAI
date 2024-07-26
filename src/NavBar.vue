<script setup>
import ToolsBar from './components/NavBar/ToolsBar.vue'
import EventBus from './assets/common/event-bus';

const name_en = ["File", "Model", "Sketch", "Design", "Display", "Assembly", "Measure", "Facets", "Repair", "Prepare", "Workbench", "Detail", "Sheet_Metal", "Tools", "KeyShot"];
const name_zh = ["文件", "建模", "草图", "设计", "展示", "装配", "测量", "平面", "修复", "预处理", "工作台", "详细", "金属薄板", "工具", "渲染"];
// 0: 大图标 1:中图标 2:小图标 
const toolModules = [
  // 文件
  [
    {
      name: "标准",
      tools: [
        {
          title: "新建",
          icon: "icon-newfile",
          type: 0,
        },
        {
          title: "打开",
          icon: "icon-open",
          type: 0,
        },
        {
          title: "保存",
          icon: "icon-Save",
          type: 0,
        }
      ]
    }
  ],
  // 建模
  [
    {
      name: "模型",
      tools: [
        {
          title: "立方体",
          icon: "icon-m_ac_set",
          type: 1,
        },
        {
          title: "圆柱体",
          icon: "icon-cylinder",
          type: 1,
        },
        {
          title: "圆锥",
          icon: "icon-yuanzhuiti",
          type: 1,
        },
        {
          title: "球体",
          icon: "icon-fi-sr-sphere",
          type: 1,
        }
      ]
    },
    {
      name: "直接草图",
      tools: [
        {
          title: "草图",
          icon: "icon-sketch",
          type: 0,
        },
        {
          title: "曲线",
          icon: "icon-shuizhiquxian",
          type: 1,
        },
        {
          title: "直线",
          icon: "icon-zhixian",
          type: 1,
        },
        {
          title: "矩形",
          icon: "icon-huajuxing",
          type: 1,
        },
        {
          title: "弧线",
          icon: "icon-quxian",
          type: 1,
        }
      ]
    },
    {
      name: "布尔运算",
      tools: [
        {
          title: "布尔运算",
          icon: "icon-bueryunsuan",
          type: 0,
        },
        {
          title: "交运算",
          icon: "icon-bueryunsuan_AND",
          type: 2,
        },
        {
          title: "差运算",
          icon: "icon-bueryunsuan_A-B",
          type: 2,
        },
        {
          title: "并运算",
          icon: "icon-bueryunsuan_OR",
          type: 2,
        },
      ]
    },
  ],
  [
    {

    }
  ],
  [
    {

    }
  ],
  [
    {

    }
  ],
  [
    {

    }
  ],
  [
    {

    }
  ],
  [
    {

    }
  ],
  [
    {

    }
  ],
  [
    {

    }
  ],
  [
    {

    }
  ],
  [
    {

    }
  ],
  [
    {

    }
  ],
  [
    {

    }
  ],
  [
    {

    }
  ],
]
const MenuBar = []
for (let i = 0; i < name_en.length; i++) {
  MenuBar.push({
    name_en: name_en[i],
    name_zh: name_zh[i],
    id: "nav-" + name_en[i] + "-tab",
    target: "#nav-" + name_en[i],
    controls: "nav-" + name_en[i],
    toolModules: toolModules[i],
  })
}

// 点击工具 val: ["File", "保存"]
const HandleClick = (val) => {
  console.log("NavBar", val);
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

    <div class="nav_mid nav nav-tabs" id="nav-tab" role="tablist">
      <button v-for="item in MenuBar" :key="item.name_en"
        :class="item.name_en == 'File' ? 'nav-link active' : 'nav-link'" :id="item.id" data-bs-toggle="tab"
        :data-bs-target="item.target" type="button" role="tab" :aria-controls="item.controls" aria-selected="false">
        {{ item.name_zh }}</button>
    </div>

    <div class="nav_right"></div>
  </nav>

  <section class="tab-content" id="nav-tabContent">
    <div v-for="item in MenuBar" :key="item.name_en"
      :class="item.name_en == 'File' ? 'tab-pane fade active show' : 'tab-pane fade'" :id="item.controls"
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

button{
  color: #fff;
}
button:hover{
  color: #fff;
}
</style>
