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
import vtkConcentricCylinderSource from '@kitware/vtk.js/Filters/Sources/ConcentricCylinderSource';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';


import { ColorMode, ScalarMode }    from '@kitware/vtk.js/Rendering/Core/Mapper/Constants';

// import controlPanel from './controlPanel.html';


let fullScreenRenderer = ref(null);
let msg = ref("dasdasd")
onMounted(() => {
  fullScreenRenderer.value = vtkFullScreenRenderWindow.newInstance({
    background: [0.5, 0.5, 0.5],
    container: sectionRef.value,
  });
  msg.value = "changed"
  console.log(`the component is now mounted.`)
  console.log(sectionRef.value);
  console.log(sectionRef);
  console.log(fullScreenRenderer.value);
  console.log(fullScreenRenderer);
  console.log(msg.value);
  console.log(msg);
  const renderer = fullScreenRenderer.value.getRenderer();
  const renderWindow = fullScreenRenderer.value.getRenderWindow();

  const cylinder = vtkConcentricCylinderSource.newInstance({
    height: 0.25,
    radius: [0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9, 1],
    cellFields: [0, 0.2, 0.4, 0.6, 0.7, 0.8, 0.9, 1],
    resolution: 60,
    skipInnerFaces: true,
  });
  const actor = vtkActor.newInstance();
  const mapper = vtkMapper.newInstance();

  actor.setMapper(mapper);
  mapper.setInputConnection(cylinder.getOutputPort());

  renderer.addActor(actor);
  renderer.resetCamera();
  renderWindow.render();

  // global.cylinder = cylinder;
  // global.renderer = renderer;
  // global.renderWindow = renderWindow;
});

defineExpose({
  fullScreenRenderer,
  // msg
});
</script>


<style scoped>
div {
  background-color: #000;
}
</style>
