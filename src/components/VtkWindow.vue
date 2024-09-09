<template>
  <div click="sendCamerainfo()" ref="sectionRef">
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
import vtkCellPicker from '@kitware/vtk.js/Rendering/Core/CellPicker';
import vtkPointPicker from '@kitware/vtk.js/Rendering/Core/PointPicker';

import EventBus from '@/assets/common/event-bus';
import axios from 'axios'
// import api from '@/assets/common/request.js'

import LightController from '@/assets/common/LightControl';
import CameraController from '@/assets/common/CameraControl';
import ModelController from '@/assets/common/ModelControl';
import InteractorController from '@/assets/common/interactorControl';
import { saveFile, FIlETYPES } from '@/assets/common/FileControl';

const global = {};
// ================================================================================ 组件控制器
// 定义模型数据
const ModelTypeIndex = {};
const SketchTypeIndex = {};
for (let i = 0; i < ModelController.ModelName.length; i++)
  ModelTypeIndex[ModelController.ModelName[i]] = i;
for (let i = 0; i < ModelController.SketchName.length; i++)
  SketchTypeIndex[ModelController.SketchName[i]] = i;
const FileIcon = ModelController.FileIcon;
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
    "voxelModel": VoxelModel,
    "visibility": Boolean
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
    parent: null,
    visibility: true,
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
          break;
        case '导出':
          saveFile(global.modelController, FIlETYPES[val[2]]);
          break;
      }
      break;
    case '模型':
      const type1 = ModelTypeIndex[val[1]];
      if (type1 < 4)
        global.modelController.createModel3(type1);
      else
        EventBus.emit("component-add-query", ['default', 1, 5]);
      break;
    case '直接草图':
      const type2 = SketchTypeIndex[val[1]];
      if (type2 >= 0)
        global.modelController.createModel2(type2);
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
onMounted(() => {
  // ================================================================================ fullScreenRenderer
  global.fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
    background: [0.1, 0.1, 0.9],
    container: sectionRef.value,
  });
  global.renderer = global.fullScreenRenderer.getRenderer();
  global.renderWindow = global.fullScreenRenderer.getRenderWindow();
  global.interactor = global.fullScreenRenderer.getInteractor();

  global.camera = global.renderer.getActiveCamera();
  // global.interactorStyle = global.interactor.getInteractorStyle();
  global.picker = vtkPicker.newInstance();
  global.cellPicker = vtkCellPicker.newInstance();
  global.pointPicker = vtkPointPicker.newInstance();
  global.interactor.setPicker(global.picker);
  // ================================================================================ Custom Controller
  global.lightController = new LightController(global.renderer);
  global.lightController.on();
  global.cameraController = new CameraController(global.renderer);
  global.cameraController.on();
  global.modelController = new ModelController(global.renderer, ModelData);
  global.modelController.on();
  global.interactorController = new InteractorController(global.fullScreenRenderer, sectionRef.value);
  global.interactorController.on();
  global.interactorController.showAxes(true);
  // ================================================================================ flash renderer
  global.renderer.resetCamera();
  global.renderWindow.render();
});
</script>


<style scoped>
div {
  margin: 3px;
  /* background-color: #000; */
  /* border: 1px solid #ccc */
}
</style>
