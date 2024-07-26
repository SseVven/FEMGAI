<template>
  <div ref="sectionRef">
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const sectionRef = ref();

import '@kitware/vtk.js/favicon';
// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import '@kitware/vtk.js/Rendering/Profiles/Geometry';

import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';

// import controlPanel from './controlPanel.html';
import EventBus from '@/assets/common/event-bus';
// import source
import vtkCubeSource from '@kitware/vtk.js/Filters/Sources/CubeSource';
import vtkConeSource from '@kitware/vtk.js/Filters/Sources/ConeSource';
import vtkCylinderSource from '@kitware/vtk.js/Filters/Sources/CylinderSource';
import vtkSphereSource from '@kitware/vtk.js/Filters/Sources/SphereSource';
import vtkAxesActor from '@kitware/vtk.js/Rendering/Core/AxesActor';
import vtkOrientationMarkerWidget from '@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget';


let fullScreenRenderer = ref(null);
const global = {};
onMounted(() => {
  // 生成window
  fullScreenRenderer.value = vtkFullScreenRenderWindow.newInstance({
    background: [0.5, 0.5, 0.5],
    container: sectionRef.value,
  });
  global.renderer = fullScreenRenderer.value.getRenderer();
  global.renderWindow = fullScreenRenderer.value.getRenderWindow();
  global.interactor = fullScreenRenderer.value.getInteractor();
  // 设置背景
  global.renderer.setBackground(255,255,255);
  // 生成 axes actor
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

  global.renderer.resetCamera();
  global.renderWindow.render();
});

//定义api
const createModel3 = (modelName) => {
  // let source = vtkConcentricCylinderSource.newInstance({
  //   height: 0.25,
  //   radius: [0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9, 1],
  //   cellFields: [0, 0.2, 0.4, 0.6, 0.7, 0.8, 0.9, 1],
  //   resolution: 60,
  //   skipInnerFaces: true,
  // });
  let source;
  if (modelName == '立方体') {
    source = vtkCubeSource.newInstance({
      xLength: 1,
      yLength: 1,
      zLength: 1,
    });
  } else if (modelName == '圆锥') {
    source = vtkConeSource.newInstance({
      height: 1,
      radius: 1,
      resolution: 100
    });
  } else if (modelName == '圆柱体') {
    source = vtkCylinderSource.newInstance({
      height: 1,
      radius: 1,
    });
  } else if (modelName == '球体') {
    source = vtkSphereSource.newInstance({
      radius: 0.1,
    });
  } else {
    return;
  }
  const actor = vtkActor.newInstance();
  const mapper = vtkMapper.newInstance();

  actor.setMapper(mapper);
  mapper.setInputConnection(source.getOutputPort());

  global.renderer.addActor(actor);
  global.renderer.resetCamera();
  global.renderWindow.render();
}
const showAxes = () => {

}
//
EventBus.on('tool-click', (val) => {
  console.log("vtkWindow", val);
  switch (val[0]) {
    case '模型':
      createModel3(val[1]);
      break;

    default:
      break;
  }
})
//
defineExpose({
  fullScreenRenderer,
  createModel3
});
</script>


<style scoped>
div {
  margin: 3px;
  background-color: #000;
  border: 1px solid #ccc
}
</style>
