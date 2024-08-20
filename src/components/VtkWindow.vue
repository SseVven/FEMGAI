<template>
  <div @click="sendCamerainfo()" ref="sectionRef">
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const sectionRef = ref();

import '@kitware/vtk.js/favicon';
// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import '@kitware/vtk.js/Rendering/Profiles/Geometry';

import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkPicker from '@kitware/vtk.js/Rendering/Core/Picker';

import EventBus from '@/assets/common/event-bus';
import axios from 'axios'
// import api from '@/assets/common/request.js'

import vtkAxesActor from '@kitware/vtk.js/Rendering/Core/AxesActor';
import vtkOrientationMarkerWidget from '@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget';

import LightController from '@/assets/common/LightControl';
import CameraController from '@/assets/common/CameraControl';
import ModelController from '@/assets/common/ModelControl';
import saveFile from '@/assets/common/FileControl';

let fullScreenRenderer = ref(null);
const global = {};
// ================================================================================ 组件控制器
// 定义模型数据
const ModelTypeIndex = { "立方体": 0, "圆锥": 1, "圆柱体": 2, "球体": 3, "布尔体": 4, }
const FileIcon = ["icon-wenjian", "icon-m_ac_set", "icon-bujian"]
const ModelData = {
  /*
  "key":{
    "type": String
    "model_type": String
    "name": String
    "actor": vtkActor
    "params": Object
    "volumns": Array
    "property":
    "components": Array，
    “data": polydata,
    "icon": String,
    "parent": String,
    "voxelModel": VoxelModel
  }
  */
}
const DataStruct = [
  {
    title: 'File-' + 'default',
    type: 'File',
    key: 'default',
    children: [],
    icon: FileIcon[0],
    parent: null
  }
]
ModelData['default'] = {
  name: DataStruct[0].title,
  type: DataStruct[0].type,
  key: 'default',
  components: [],
  icon: FileIcon[0],
  parent: null
};

// 初始化
EventBus.emit("dataStructChange", [0, DataStruct]);
// ================================================================================ cameracontrol
const sendCamerainfo = () => {
  EventBus.emit("camera-info", {
    Position: global.camera.getPosition(),
    ViewUp: global.camera.getViewUp(),
    ViewAngle: global.camera.getViewAngle(),
    FocalPoint: global.camera.getFocalPoint(),
    ClippingRange: global.camera.getClippingRange(),
  })
}
// ================================================================================ navBar toolBtn
EventBus.on('tool-click', (val) => {
  console.log("vtkWindow", val);
  switch (val[0]) {
    case '标准':
      switch (val[1]) {
        case '打开':
          break;
        case '保存':
          saveFile();
          break;
      }
      break;
    case '模型':
      global.modelController.createModel3(ModelTypeIndex[val[1]]);
      break;
    case '直接草图':
      break;
    case '布尔运算':
      EventBus.emit("LeftBar-open", ['BoolBar', val[1]]);
      break;
    case '特征':
      const model = global.modelController.getActiveModel();
      switch (val[1]) {
        case '旋转':
          if (model)
            EventBus.emit("LeftBar-Modal-open", ['Rotate', [1, 0, 0, 0, 0, 0, 360]]);
          break;
        case '伸缩':
          if (model)
            EventBus.emit("LeftBar-Modal-open", ['Scale', model.getMatrix().getScale()]);
          break;
      }
      break;
    default:
      break;
  }
})
//
// const resetActor = () => {
//   if (global.activeActor) {
//     global.activeActor.getProperty().setColor(global.activeColor);
//     global.activeActor = null;
//     global.renderWindow.render();
//   }
// }
// const ChooseActor = (actor) => {
//   if (actor) {
//     global.activeActor = actor;
//     global.activeColor = global.activeActor.getProperty().getColor();
//     actor.getProperty().setColor(1, 0, 0);
//     global.renderWindow.render();
//   }
// }
onMounted(() => {
  // ================================================================================ fullScreenRenderer
  fullScreenRenderer.value = vtkFullScreenRenderWindow.newInstance({
    background: [0.1, 0.1, 0.9],
    container: sectionRef.value,
  });
  global.renderer = fullScreenRenderer.value.getRenderer();
  global.renderWindow = fullScreenRenderer.value.getRenderWindow();
  global.interactor = fullScreenRenderer.value.getInteractor();

  global.camera = global.renderer.getActiveCamera();
  // global.interactorStyle = global.interactor.getInteractorStyle();
  global.picker = vtkPicker.newInstance();
  global.interactor.setPicker(global.picker);
  // ================================================================================ Custom Controller
  global.lightController = new LightController(global.renderer);
  global.lightController.on();
  global.cameraController = new CameraController(global.renderer);
  global.cameraController.on();
  global.modelController = new ModelController(global.renderer, ModelData);
  global.modelController.on();
  // ================================================================================ axes
  global.axesActor = vtkAxesActor.newInstance({
    config: {
      recenter: false,
      tipLength: 0.2,
      tipRadius: 0.1,
      shaftRadius: 0.03
    },
    yConfig: {
      color: [0, 255, 0],
    },
    zConfig: {
      color: [0, 0, 255]
    }
  });
  global.orientationMarkerWidget = vtkOrientationMarkerWidget.newInstance();
  global.orientationMarkerWidget.setParentRenderer(global.renderer);
  global.orientationMarkerWidget.setInteractor(global.interactor);
  global.orientationMarkerWidget.setActor(global.axesActor);
  global.orientationMarkerWidget.setEnabled(true);
  // ================================================================================ interactor
  global.interactor.onMouseMove((e) => {
    // console.log(e.position);
    global.picker.pick([e.position.x, e.position.y, 0], global.renderer);
    // global.picker.pick3DPoint([0,0, 12],[0,0,-12], global.renderer);
    // console.log(global.picker.getActors());

    global.modelController.resetActor();
    if (global.picker.getActors().length)
      global.modelController.chooseActor(global.picker.getActors()[0]);
  });
  global.interactor.onLeftButtonPress((e) => {
    const actActor = global.modelController.activeActor;
    if (actActor)
      EventBus.emit("component-node-query", [global.modelController.findModelDataByActor(actActor).key]);
  })

  // ================================================================================ flash renderer
  global.renderer.resetCamera();
  global.renderWindow.render();
});

defineExpose({
  fullScreenRenderer
});
</script>


<style scoped>
div {
  margin: 3px;
  background-color: #000;
  /* border: 1px solid #ccc */
}
</style>
