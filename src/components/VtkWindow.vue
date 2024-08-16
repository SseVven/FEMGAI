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
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkLight from '@kitware/vtk.js/Rendering/Core/Light';
import vtkPicker from '@kitware/vtk.js/Rendering/Core/Picker'

// import controlPanel from './controlPanel.html';
import EventBus from '@/assets/common/event-bus';
import { math } from '@/assets/common/math';
import axios from 'axios'
// import api from '@/assets/common/request.js'

import vtkAxesActor from '@kitware/vtk.js/Rendering/Core/AxesActor';
import vtkOrientationMarkerWidget from '@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget';

import vtkCellArray from '@kitware/vtk.js/Common/Core/CellArray';
import vtkPoints from '@kitware/vtk.js/Common/Core/Points';
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';

// import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';
// import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
// import vtkHttpDataSetReader from '@kitware/vtk.js/IO/Core/HttpDataSetReader';
// import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';


let fullScreenRenderer = ref(null);
const global = {};

// ================================================================================ 组件控制器
// 定义模型数据
const FileType = {
  "File": 0,
  "Model": 1,
  "Component": 2,
}
const FileName = [
  "File", "Model", "Component"
]
const FileIcon = [
  "icon-wenjian",
  "icon-m_ac_set",
  "icon-bujian"
]
const ModelType = {
  "立方体": 0x1,
  "圆锥": 0x2,
  "圆柱体": 0x4,
  "球体": 0x8,
  "布尔体": 0x10,
}
const ModelTypeIndex = {
  "立方体": 0,
  "圆锥": 1,
  "圆柱体": 2,
  "球体": 3,
  "布尔体": 4,
}
const ModelName = [
  "立方体", "圆锥", "圆柱体", "球体", "布尔体"
]
const ModelIcon = [
  "icon-m_ac_set",
  "icon-yuanzhuiti",
  "icon-cylinder",
  "icon-fi-sr-sphere",
  "icon-bueryunsuan",
]
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
const getAUniKey = () => {
  return new Date().getTime().toString(36);
}
const getAKey = getAUniKey();
const DataStruct = [
  {
    title: 'File-' + getAKey,
    type: 'File',
    key: getAKey,
    children: [],
    icon: FileIcon[0],
    parent: null
  }
]
ModelData[getAKey] = {
  name: DataStruct[0].title,
  type: DataStruct[0].type,
  key: getAKey,
  components: [],
  icon: FileIcon[0],
  parent: null
};
// voxel modeling
class Voxel {
  constructor() {
  }
  static Precision = () => 0.05; // 1cm
}
class VoxelModel {
  constructor(type, params) {
    this.type = type;
    this.center = [0, 0, 0];
    this.resetParams(params);
  }
  resetParams(params) {
    this.voxelData = {};
    this.points = [];
    this.faces = [];
    const precision = Voxel.Precision();
    const halfPrecision = math.divide(precision, 2);
    this.precision = precision;
    this.halfPrecision = halfPrecision;
    if (this.type == 'default') {
      for (let i = 0; i < params.length; i++) {
        const pos = params[i];

        if (!(pos[0] in this.voxelData)) {
          this.voxelData[pos[0]] = {};
        }
        if (!(pos[1] in this.voxelData[pos[0]])) {
          this.voxelData[pos[0]][pos[1]] = {};
        }
        this.voxelData[pos[0]][pos[1]][pos[2]] = true;
      }
    }
    else if (this.type == '立方体') {
      for (let i = halfPrecision; i < params.XLen; i = math.add(i, precision)) {
        this.voxelData[i] = {};
        const iAdd = math.add(i, precision);
        const iFirst = i == halfPrecision;
        for (let j = halfPrecision; j < params.YLen; j = math.add(j, precision)) {
          this.voxelData[i][j] = {};
          const jAdd = math.add(j, precision);
          const jFirst = j == halfPrecision;
          for (let k = halfPrecision; k < params.ZLen; k = math.add(k, precision)) {
            const out = [iFirst,//L
              k == halfPrecision, // B
              iAdd >= params.XLen, //R
              math.add(k, precision) >= params.ZLen, // F
              jAdd >= params.YLen, // U
              jFirst]; // D
            this.voxelData[i][j][k] = out;
          }
        }
      }
    }
    else if (this.type == '圆锥') {
      for (let i = halfPrecision; i < params.height; i = math.add(i, precision)) {
        this.voxelData[i] = {};
        const YLimit = params.radius * (1 - i / params.height);
        const powYLimit = Math.pow(YLimit, 2);
        const iFirst = i == halfPrecision;
        const iAdd = Math.pow(params.radius * (1 - (i + precision) / params.height), 2);
        for (let j = halfPrecision; j < YLimit; j = math.add(j, precision)) {
          this.voxelData[i][j] = {};
          this.voxelData[i][-j] = {};
          const powJ = j * j;
          const ZLimit = Math.sqrt(powYLimit - powJ);
          const jAdd = Math.pow(j + precision, 2);
          for (let k = halfPrecision; k < ZLimit; k = math.add(k, precision)) {
            const out = [iFirst,//L
              jAdd + k * k >= powYLimit, // U
              k + precision >= ZLimit, //F
              powJ + k * k >= iAdd] // R

            this.voxelData[i][j][k] = [out[0], false, out[3], out[2], out[1], false];
            this.voxelData[i][j][-k] = [out[0], out[2], out[3], false, out[1], false];
            this.voxelData[i][-j][k] = [out[0], false, out[3], out[2], false, out[1]];
            this.voxelData[i][-j][-k] = [out[0], out[2], out[3], false, false, out[1]];
          }
        }
      }
    }
    else if (this.type == '圆柱体') {
      const powRadius = Math.pow(params.radius, 2);
      for (let i = halfPrecision; i < params.height; i = math.add(i, precision)) {
        this.voxelData[i] = {};
        const iFirst = i == halfPrecision;
        const iAdd = i + precision;
        for (let j = halfPrecision; j < params.radius; j = math.add(j, precision)) {
          this.voxelData[i][j] = {};
          this.voxelData[i][-j] = {};
          const ZLimit = Math.sqrt(Math.pow(params.radius, 2) - j * j);
          const JAdd = Math.pow(j + precision, 2);
          for (let k = halfPrecision; k < ZLimit; k = math.add(k, precision)) {
            const out = [iFirst,//L
              JAdd + k * k >= powRadius, // U
              k + precision >= ZLimit, //F
              iAdd >= params.height] // R

            this.voxelData[i][j][k] = [out[0], false, out[3], out[2], out[1], false];
            this.voxelData[i][j][-k] = [out[0], out[2], out[3], false, out[1], false];
            this.voxelData[i][-j][k] = [out[0], false, out[3], out[2], false, out[1]];
            this.voxelData[i][-j][-k] = [out[0], out[2], out[3], false, false, out[1]];
          }
        }
      }
    }
    else if (this.type == '球体') {
      const powRadius = Math.pow(params.radius, 2);
      for (let i = halfPrecision; i < params.radius; i = math.add(i, precision)) {
        this.voxelData[i] = {};
        this.voxelData[-i] = {};
        const powI = i * i;
        const YLimit = Math.sqrt(powRadius - powI);
        const powYLimit = Math.pow(YLimit, 2);
        const IAdd = Math.pow(i + precision, 2);
        for (let j = halfPrecision; j < YLimit; j = math.add(j, precision)) {
          this.voxelData[i][j] = {};
          this.voxelData[i][-j] = {};
          this.voxelData[-i][j] = {};
          this.voxelData[-i][-j] = {};
          const powJ = j * j;
          const ZLimit = Math.sqrt(powRadius - powI - powJ);
          const JAdd = Math.pow(j + precision, 2);
          for (let k = halfPrecision; k < ZLimit; k = math.add(k, precision)) {
            const powK = k * k;
            const out = [JAdd + powK >= powYLimit, // U
            k + precision >= ZLimit, //F
            IAdd + powK + powJ >= powRadius] // R

            this.voxelData[i][j][k] = [false, false, out[2], out[1], out[0], false];
            this.voxelData[i][j][-k] = [false, out[1], out[2], false, out[0], false];
            this.voxelData[i][-j][k] = [false, false, out[2], out[1], false, out[0]];
            this.voxelData[i][-j][-k] = [false, out[1], out[2], false, false, out[0]];
            this.voxelData[-i][j][k] = [out[2], false, false, out[1], out[0], false];
            this.voxelData[-i][j][-k] = [out[2], out[1], false, false, out[0], false];
            this.voxelData[-i][-j][k] = [out[2], false, false, out[1], false, out[0]];
            this.voxelData[-i][-j][-k] = [out[2], out[1], false, false, false, out[0]];
          }
        }
      }
    }
    else if (this.type == '布尔体') {
      const boolType = params.boolType;
      const target = params.target.voxelModel;
      const tools = [];
      for (let i = 0; i < params.tools.length; i++)
        tools.push(params.tools[i].voxelModel.voxelData);

      this.voxelData = target.voxelData;
      this.center = target.center;

      console.log([boolType, this.voxelData, tools]);

      if (boolType == '交运算') {
        // 删除与tools不相交的体素点
        for (let x in this.voxelData) {
          const dataX = this.voxelData[x];
          for (let y in dataX) {
            const dataY = dataX[y];
            for (let z in dataY) {
              // 遍历这个点是否在所有tools中都存在
              let flag = false;
              for (let i = 0; i < tools.length; i++) {
                const toolModel = params.tools[i].voxelModel;
                const point = toolModel.ralativeVoxelPos(this, [x, y, z]);

                if (!toolModel.hasPoint(point)) {
                  flag = true;
                  break;
                }
              }
              if (flag) {
                // del这个点
                const point = [x, y, z];
                delete this.voxelData[point[0]][point[1]][point[2]];
                // 给这个点的邻接点附加边
                point[0] = math.subtract(point[0], precision);
                if (this.hasPoint(point))
                  this.voxelData[point[0]][point[1]][point[2]][2] = true;
                point[0] = math.add(point[0], precision);
                point[2] = math.subtract(point[2], precision);
                if (this.hasPoint(point))
                  this.voxelData[point[0]][point[1]][point[2]][3] = true;
                point[2] = math.add(point[2], precision);
                point[0] = math.add(point[0], precision);
                if (this.hasPoint(point))
                  this.voxelData[point[0]][point[1]][point[2]][0] = true;
                point[0] = math.subtract(point[0], precision);
                point[2] = math.add(point[2], precision);
                if (this.hasPoint(point))
                  this.voxelData[point[0]][point[1]][point[2]][1] = true;
                point[2] = math.subtract(point[2], precision);
                point[1] = math.add(point[1], precision);
                if (this.hasPoint(point))
                  this.voxelData[point[0]][point[1]][point[2]][5] = true;
                point[1] = math.subtract(point[1], precision);
                point[1] = math.subtract(point[1], precision);
                if (this.hasPoint(point))
                  this.voxelData[point[0]][point[1]][point[2]][4] = true;
              }
            }
          }
        }
      } else if (boolType == '差运算') {
        // 删除tools相交的体素点
        for (let i = 0; i < tools.length; i++) {
          const toolVoxelData = tools[i];
          const toolModel = params.tools[i].voxelModel;
          // 遍历删除体素点，判断删除点是不是边界点
          for (let x in toolVoxelData) {
            const dataX = toolVoxelData[x];
            for (let y in dataX) {
              const dataY = dataX[y];
              for (let z in dataY) {
                const point = this.ralativeVoxelPos(toolModel, [x, y, z]);
                if (this.hasPoint(point)) {
                  // del这个点
                  delete this.voxelData[point[0]][point[1]][point[2]];
                  // 给这个点的邻接点附加边
                  point[0] = math.subtract(point[0], precision);
                  if (this.hasPoint(point))
                    this.voxelData[point[0]][point[1]][point[2]][2] = true;
                  point[0] = math.add(point[0], precision);
                  point[2] = math.subtract(point[2], precision);
                  if (this.hasPoint(point))
                    this.voxelData[point[0]][point[1]][point[2]][3] = true;
                  point[2] = math.add(point[2], precision);
                  point[0] = math.add(point[0], precision);
                  if (this.hasPoint(point))
                    this.voxelData[point[0]][point[1]][point[2]][0] = true;
                  point[0] = math.subtract(point[0], precision);
                  point[2] = math.add(point[2], precision);
                  if (this.hasPoint(point))
                    this.voxelData[point[0]][point[1]][point[2]][1] = true;
                  point[2] = math.subtract(point[2], precision);
                  point[1] = math.add(point[1], precision);
                  if (this.hasPoint(point))
                    this.voxelData[point[0]][point[1]][point[2]][5] = true;
                  point[1] = math.subtract(point[1], precision);
                  point[1] = math.subtract(point[1], precision);
                  if (this.hasPoint(point))
                    this.voxelData[point[0]][point[1]][point[2]][4] = true;
                }
              }
            }
          }
        }
      } else if (boolType == '并运算') {
        // 添加tools的体素点
        for (let i = 0; i < tools.length; i++) {
          const toolVoxelData = tools[i];
          const toolModel = params.tools[i].voxelModel;
          // 遍历删除体素点，判断删除点是不是边界点
          for (let x in toolVoxelData) {
            const dataX = toolVoxelData[x];
            for (let y in dataX) {
              const dataY = dataX[y];
              for (let z in dataY) {
                const faces = toolVoxelData[x][y][z];
                const point = this.ralativeVoxelPos(toolModel, [x, y, z]);

                if (this.hasPoint(point)) {
                  const tpoint = this.getPoint(point);
                  for (let j = 0; j < 6; j++) {
                    tpoint[j] &= faces[j];
                  }
                } else
                  this.addPoint(point, faces);
              }
            }
          }
        }
      }
    }
    this.setPointsFacesByVoxelData();
  }
  addPoints(center) {
    const halfPrecision = this.halfPrecision;
    const i = center[0];
    const j = center[1];
    const k = center[2];
    this.points.push([i - halfPrecision, j - halfPrecision, k - halfPrecision]);
    this.points.push([i + halfPrecision, j - halfPrecision, k - halfPrecision]);
    this.points.push([i + halfPrecision, j + halfPrecision, k - halfPrecision]);
    this.points.push([i - halfPrecision, j + halfPrecision, k - halfPrecision]);
    this.points.push([i - halfPrecision, j - halfPrecision, k + halfPrecision]);
    this.points.push([i + halfPrecision, j - halfPrecision, k + halfPrecision]);
    this.points.push([i + halfPrecision, j + halfPrecision, k + halfPrecision]);
    this.points.push([i - halfPrecision, j + halfPrecision, k + halfPrecision]);
  }
  addFace(direct, add) {
    switch (direct) {
      case 0:
      case 'L':
        this.faces.push([4 + add, 7 + add, 3 + add, 0 + add]);
        break;
      case 1:
      case 'B':
        this.faces.push([0 + add, 1 + add, 2 + add, 3 + add]);
        break;
      case 2:
      case 'R':
        this.faces.push([1 + add, 2 + add, 6 + add, 5 + add]);
        break;
      case 3:
      case 'F':
        this.faces.push([4 + add, 5 + add, 6 + add, 7 + add]);
        break;
      case 4:
      case 'U':
        this.faces.push([7 + add, 6 + add, 2 + add, 3 + add]);
        break;
      case 5:
      case 'D':
        this.faces.push([4 + add, 5 + add, 1 + add, 0 + add]);
        break;
      default:
        break;
    }
  }
  setPointsFacesByVoxelData() {
    for (let x in this.voxelData) {
      const dataX = this.voxelData[x];
      for (let y in dataX) {
        const dataY = dataX[y];
        for (let z in dataY) {
          const point = [parseFloat(x), parseFloat(y), parseFloat(z)];
          const faceStatus = dataY[z];

          const add = this.points.length;
          let cnt = 0;
          for (let i = 0; i < 6; i++) {
            // console.log(faceStatus);

            if (faceStatus[i]) {
              this.addFace(i, add);
              cnt++;
            }
          }
          if (cnt)
            this.addPoints(point);
        }
      }
    }
  }
  ralativeVoxelPos(VoxelModel, pos) {
    const tmp = [...pos];
    for (let i = 0; i < 3; i++)
      tmp[i] = math.subtract(math.add(pos[i], VoxelModel.center[i]), this.center[i]);
    return tmp;
  }
  hasPoint(pos) {
    let tmp = this.voxelData;
    for (let i = 0; i < 3; i++) {
      if (!(pos[i] in tmp))
        return false;
      tmp = tmp[pos[i]];
    }
    return true;
  }
  addPoint(pos, val) {
    if (!(pos[0] in this.voxelData))
      this.voxelData[pos[0]] = {};
    if (!(pos[1] in this.voxelData[pos[0]]))
      this.voxelData[pos[0]][pos[1]] = {};
    this.voxelData[pos[0]][pos[1]][pos[2]] = val;
  }
  getPoint(pos) {
    return this.voxelData[pos[0]][pos[1]][pos[2]];
  }
}

// 组件控制器 修改
const onChange = (val) => {
  EventBus.emit("dataStructChange", val);
}
// 初始化
onChange([0, DataStruct]);
EventBus.on('component-node-query', (val) => {
  // console.log("component-node-query", val);
  EventBus.emit("component-node-queryRes", ModelData[val[0]]);
})
// info changed
EventBus.on('Property-changed', (val) => {
  console.log("Property-changed", val);
  if (val[1] == 'color')
    ModelData[val[0]].actor.getProperty().setColor(ModelData[val[0]].property.color)
  else if (val[1] == 'opacity')
    ModelData[val[0]].actor.getProperty().setOpacity(ModelData[val[0]].property.opacity)
  else if (val[1] == 'params') {
    setPolyData(ModelData[val[0]].model_type, ModelData[val[0]].params, ModelData[val[0]].data);
  } else if (val[1] == 'voxelModel') {
    setPolyData('体素', ModelData[val[0]].voxelModel, ModelData[val[0]].data);
  } else if (val[1] == 'voxelModelparams') {
    ModelData[val[0]].voxelModel.resetParams(ModelData[val[0]].params);
    setPolyData('体素', ModelData[val[0]].voxelModel, ModelData[val[0]].data);
  }
  global.renderWindow.render();
})
// 添加 Model
const newAModelData = (type) => {
  const obj = {
    key: getAUniKey(),
    type: FileName[type],
    name: FileName[type],
    params: {},
    property: {},
    components: [],
    icon: FileIcon[type]
  };
  return obj;
}
//
EventBus.on('component-add-query', (val) => {
  const data = ModelData[val[0]];
  if (data == null)
    return;
  // console.log("component-add-query", val, data);

  // 添加模型
  if (val[1] == 1) {
    createModel3(ModelName[val[2]], data.key);
    return;
  }
  const model = newAModelData(val[1]);
  model.parent = data.key;
  ModelData[model.key] = model;
  // console.log(ModelData);

  data.components.push(model.key);
  // 1：添加节点 ；[x,x]添加到哪一层 ; 节点key； 名称
  onChange([1, data.key, model.key, model.name, model.type, model.icon]);
})
EventBus.on('component-remove-query', (val) => {
  const data = ModelData[val];
  // console.log("component-remove-query", val, data, DataStruct, ModelData);
  // 找到父节点然后删掉 or 遍历移除掉 data 的components 的actor
  const myque = [data.key];
  while (myque.length > 0) {
    const node = ModelData[myque[0]];
    myque.shift();
    if ('components' in node) {
      for (let i = 0; i < node.components.length; i++)
        myque.push(node.components[i]);
    } else {
      global.renderer.removeActor(node.actor);
    }
  }
  global.renderWindow.render();
})
// ================================================================================ 组件控制器 end

//定义api
// ================================================================================ cameracontrol
const cameraControl = async (mode, params) => {
  // 固定视角
  if (mode === 0) {
    // console.log("mode:0");
    global.camera.setPosition(params.Position[0], params.Position[1], params.Position[2]);
    global.camera.setFocalPoint(params.FocalPoint[0], params.FocalPoint[1], params.FocalPoint[2])
    global.camera.setViewUp(params.ViewUp[0], params.ViewUp[1], params.ViewUp[2])
    global.camera.setViewAngle(params.ViewAngle)
  } else if (mode === 1) {
    // console.log("mode:1");
    global.camera.setPosition(params.Position[0], params.Position[1], params.Position[2]);
    global.camera.setFocalPoint(params.FocalPoint[0], params.FocalPoint[1], params.FocalPoint[2])
    global.camera.setViewUp(params.ViewUp[0], params.ViewUp[1], params.ViewUp[2])
    global.camera.setViewAngle(params.ViewAngle)
    global.renderer.resetCamera();
  }
  // 移动视角
  else if (mode === 2) {
    console.log("mode:2", mode, params);
    // 延时旋转相机位置
    global.camera.setViewUp(params.ViewUp[0], params.ViewUp[1], params.ViewUp[2])
    global.camera.setViewAngle(params.ViewAngle)
    let prePoint = [...params.Position];
    if (params.Times.length == 1) {
      for (let i = 0; i < params.MidPoses.length; i++) {
        const point = params.MidPoses[i];
        const pNum = params.Times[0] * 100;
        const interval = [(point[0] - prePoint[0]) / pNum, (point[1] - prePoint[1]) / pNum, (point[2] - prePoint[2]) / pNum]

        console.log(prePoint, point, interval);
        for (let j = 1; j <= pNum; j++) {
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
              global.camera.setPosition(prePoint[0] + interval[0] * j, prePoint[1] + interval[1] * j, prePoint[2] + interval[2] * j);
              global.renderer.resetCamera();
              global.renderWindow.render();
            }, params.Times[0] * 10);
          });
        }

        prePoint = [...point];
      }
    } else {

    }
  }
  // global.renderer.resetCamera();
  global.renderWindow.render();
  PreCameraControl = 0;
  console.log("DONE32131312");
};
// 接收信息
let PreCameraControl = 0;
EventBus.on('camera-choose', (val) => {
  if (val)
    if (PreCameraControl == 0) {
      console.log("'camera-choose get:'", val);
      PreCameraControl = 1;
      cameraControl(val[0], val[1]);
    }
    else {
      //   // 打断上一个相机控制  然后再执行新的相机控制

    }
})
// 传递相机参数
const sendCamerainfo = () => {
  EventBus.emit("camera-info", {
    Position: global.camera.getPosition(),
    ViewUp: global.camera.getViewUp(),
    ViewAngle: global.camera.getViewAngle(),
    FocalPoint: global.camera.getFocalPoint(),
    ClippingRange: global.camera.getClippingRange(),
  })
}
// ================================================================================ camera control end
// ================================================================================ light control
const MyLights = {
}
const logLightsInfo = () => {
  const data = global.renderer.getLights();
  console.log("ALL lights:(" + data.length + ")");

  for (let i = 0; i < data.length; i++) {
    const light = data[i];
    const res = {
      lightType: light.getLightType(),
      position: light.getPosition(),
      focalPoint: light.getFocalPoint(),
      direction: light.getDirection(),
      color: light.getColor(),
      intensity: light.getIntensity(),
      coneAngle: light.getConeAngle(),
      coneFalloff: light.getConeFalloff(),
      exponent: light.getExponent(),
    }

    console.log(res);
  }
}
const addLight = (renderer, paramsOrLight, mode = 0) => {
  if (mode == 1) {
    renderer.addLight(paramsOrLight);
    console.log("addLight success: ", paramsOrLight);
    return;
  }
  const light = vtkLight.newInstance({
    switch: true,
    intensity: 1,
    color: paramsOrLight.color || [0, 1, 1]
  })

  renderer.addLight(light);
  console.log("addLight success: ", light);
}
EventBus.on('light-choose', (val) => {
  console.log('light-choose', val);
  let light;
  if (MyLights[val.key]) {
    light = MyLights[val.key];
  } else {
    light = vtkLight.newInstance();
    MyLights[val.key] = light;
  }

  light.setSwitch(val.Switch);
  light.setColor(val.Color);
  light.setPosition(val.Position[0], val.Position[1], val.Position[2]);
  light.setConeAngle(val.ViewAngle);

  global.renderer.addLight(light);
  global.renderWindow.render();
  logLightsInfo();
})
// ================================================================================ light end

// 输入三维向量，输出任一垂直单位向量
function getPerpendicularUnitVector(v) {
  // Destructure the input vector
  let [vx, vy, vz] = v;

  // Choose a vector that is not parallel to v
  let w;
  if (Math.abs(vx) > Math.abs(vy)) {
    w = [vy, -vx, 0];
  } else {
    w = [0, -vz, vy];
  }

  // Calculate the cross product to get a perpendicular vector
  let ux = vy * w[2] - vz * w[1];
  let uy = vz * w[0] - vx * w[2];
  let uz = vx * w[1] - vy * w[0];
  let u = [ux, uy, uz];

  // Normalize the perpendicular vector to make it a unit vector
  let length = Math.sqrt(ux * ux + uy * uy + uz * uz);
  u = u.map(component => component / length);

  return u;
}
// 输入:三维向量a,b,数字deg，输出:b绕a旋转deg°后的向量// 右手定则
function rotateVectorAroundAxis(a, b, deg) {
  // Convert degrees to radians
  let rad = deg * (Math.PI / 180);

  // Normalize vector a
  let lengthA = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
  let u = a.map(component => component / lengthA);

  let ux = u[0], uy = u[1], uz = u[2];

  // Calculate the cosine and sine of the angle
  let cosTheta = Math.cos(rad);
  let sinTheta = Math.sin(rad);

  // Rodrigues' rotation formula components
  let oneMinusCosTheta = 1 - cosTheta;
  let dotProduct = ux * b[0] + uy * b[1] + uz * b[2];

  let rotatedX = (cosTheta + ux * ux * oneMinusCosTheta) * b[0] +
    (ux * uy * oneMinusCosTheta - uz * sinTheta) * b[1] +
    (ux * uz * oneMinusCosTheta + uy * sinTheta) * b[2];

  let rotatedY = (uy * ux * oneMinusCosTheta + uz * sinTheta) * b[0] +
    (cosTheta + uy * uy * oneMinusCosTheta) * b[1] +
    (uy * uz * oneMinusCosTheta - ux * sinTheta) * b[2];

  let rotatedZ = (uz * ux * oneMinusCosTheta - uy * sinTheta) * b[0] +
    (uz * uy * oneMinusCosTheta + ux * sinTheta) * b[1] +
    (cosTheta + uz * uz * oneMinusCosTheta) * b[2];

  return [rotatedX, rotatedY, rotatedZ];
}
// 计算体素点
const getVoxelInfo = () => {

}
//
const getDefaultParams = (type) => {
  const params = {};
  if (type == '立方体') {
    params.center = [0, 0, 0];
    params.XLen = 1;
    params.YLen = 1;
    params.ZLen = 1;
  } else if (type == '圆锥') {
    params.radius = 1;
    params.height = 1;
    params.resolution = 150;
    params.center = [0, 0, 0];
    params.direct = [0, 0, 1];
  } else if (type == '圆柱体') {
    params.radius = 1;
    params.height = 1;
    params.resolution = 150;
    params.center = [0, 0, 0];
    params.direct = [0, 0, 1];
  } else if (type == '球体') {
    params.radius = 1;
    params.center = [0, 0, 0];
    params.resolution = 150;
  } else {
    return;
  }
  return params;
}
const setPolyData = (type, params, data) => {
  let points = [];
  let faces = [];
  if (type == '体素') {
    for (let i = 0; i < params.points.length; i++) {
      let tmp = [];
      for (let j = 0; j < 3; j++) {
        tmp.push(params.points[i][j] + params.center[j]);
      }
      points.push(tmp);
    }
    faces = params.faces;
  }
  else if (type == '立方体') {
    points = [[0, 0, 0], [params.XLen, 0, 0], [0, 0, params.ZLen], [params.XLen, 0, params.ZLen], [0, params.YLen, 0], [params.XLen, params.YLen, 0], [0, params.YLen, params.ZLen], [params.XLen, params.YLen, params.ZLen]];
    for (let i = 0; i < 8; i++)
      for (let j = 0; j < 3; j++)
        points[i][j] += params.center[j];
    faces = [[0, 1, 3, 2], [4, 5, 7, 6], [0, 1, 5, 4], [1, 3, 7, 5], [2, 3, 7, 6], [2, 0, 4, 6]];

  } else if (type == '圆锥') {
    const APoint = [params.direct[0] * params.height, params.direct[1] * params.height, params.direct[2] * params.height];
    const CPoint = getPerpendicularUnitVector(params.direct).map(component => component * params.radius);
    const interalDeg = 360 / params.resolution;
    points.push(APoint.map((v, k) => v + params.center[k]));
    const btm = [];
    for (let i = 0; i < params.resolution; i++) {
      points.push(rotateVectorAroundAxis(params.direct, CPoint, interalDeg * i).map((v, k) => v + params.center[k]));
      if (i == params.resolution - 1)
        faces.push([0, i + 1, 1]);
      else
        faces.push([0, i + 1, i + 2]);
      btm.push(i + 1);
    }
    faces.push(btm);
  } else if (type == '圆柱体') {
    const CPoint = getPerpendicularUnitVector(params.direct).map(component => component * params.radius);
    const interalDeg = 360 / params.resolution;
    const top = [];
    const btm = [];
    for (let i = 0; i < params.resolution; i++) {
      let tmp = rotateVectorAroundAxis(params.direct, CPoint, interalDeg * i).map((v, k) => v + params.center[k]);
      points.push(tmp);
      points.push(tmp.map((v, k) => v + params.direct[k] * params.height));

      if (i == params.resolution - 1)
        faces.push([2 * i, 2 * i + 1, 1, 0]);
      else
        faces.push([2 * i, 2 * i + 1, 2 * i + 3, 2 * i + 2]);

      btm.push(2 * i);
      top.push(2 * i + 1);
    }
    faces.push(btm);
    faces.push(top);
  } else if (type == '球体') {
    const CPoint = [params.radius, 0, 0];
    const DPoint = [-params.radius, 0, 0];
    const interalDeg1 = 180 / params.resolution;
    const interalDeg = 360 / params.resolution;

    points.push(CPoint.map((v, k) => v + params.center[k]));
    for (let i = 1; i < params.resolution; i++) {
      let tmp = rotateVectorAroundAxis([0, 1, 0], CPoint, interalDeg1 * i);
      for (let j = 0; j < params.resolution; j++) {
        let tmp2 = rotateVectorAroundAxis([1, 0, 0], tmp, interalDeg * j).map((v, k) => v + params.center[k]);

        points.push(tmp2);
      }
    }
    points.push(DPoint.map((v, k) => v + params.center[k]));

    for (let i = 0; i < params.resolution; i++) {
      if (i == params.resolution - 1) {
        faces.push([0, i + 1, 1]);
        faces.push([params.resolution * (params.resolution - 1) + 1, (params.resolution - 2) * params.resolution + i + 1, (params.resolution - 2) * params.resolution + 1]);
      }
      else {
        faces.push([0, i + 1, i + 2]);
        faces.push([params.resolution * (params.resolution - 1) + 1, (params.resolution - 2) * params.resolution + i + 1, (params.resolution - 2) * params.resolution + i + 2]);
      }
    }

    for (let i = 0; i < params.resolution - 2; i++) {
      for (let j = 0; j < params.resolution; j++) {
        if (j == params.resolution - 1)
          faces.push([i * params.resolution + j + 1, i * params.resolution + 1, (i + 1) * params.resolution + 1, (i + 1) * params.resolution + j + 1]);
        else
          faces.push([i * params.resolution + j + 1, i * params.resolution + j + 2, (i + 1) * params.resolution + j + 2, (i + 1) * params.resolution + j + 1]);
      }
    }
  }
  const vtkPs = vtkPoints.newInstance();
  const polys = vtkCellArray.newInstance();
  for (let i = 0; i < points.length; i++)
    vtkPs.insertNextPoint(points[i][0], points[i][1], points[i][2]);
  for (let i = 0; i < faces.length; i++)
    polys.insertNextCell(faces[i]);

  data.setPoints(vtkPs);
  data.setPolys(polys);
}
const createActor = (type, params = {}, data = null) => {
  const m_data = data || vtkPolyData.newInstance();
  const actor = vtkActor.newInstance();
  setPolyData(type, params, m_data);

  const mapper = vtkMapper.newInstance();
  actor.setMapper(mapper);
  mapper.setInputData(m_data);

  global.renderer.addActor(actor);
  global.renderWindow.render();

  return actor;
}
const createModel3 = (modelName, parent = DataStruct[0].key, fParams = null) => {
  const data = vtkPolyData.newInstance();
  const params = fParams || getDefaultParams(modelName);

  axios.post('/api/echo', {
    type: ModelType[modelName],
    params: params
  })
    .then(res => {
      const voxelModel = new VoxelModel(modelName, params);

      const actor = createActor('体素', voxelModel, data);

      // == 数据存储
      const uniqueId = getAUniKey()
      const property = actor.getProperty();
      // property.setEdgeColor(0, 0, 1);
      // property.setEdgeVisibility(true)
      // property.setRepresentationToWireframe()

      ModelData[uniqueId] = {
        type: 'Model',
        key: uniqueId,
        name: modelName + "-" + uniqueId,
        actor: actor,
        model_type: modelName,
        params: params,
        data: data,
        volumns: [],
        property: {
          color: property.getColor(),
          opacity: property.getOpacity(),
        },
        icon: ModelIcon[ModelTypeIndex[modelName]],
        parent: parent,
        voxelModel: voxelModel,
      };
      if (modelName == '布尔体') {
        EventBus.emit('remove-componte-query', params.target.key);
        for (let i = 0; i < params.tools.length; i++)
          EventBus.emit('remove-componte-query', params.tools[i].key);
      }

      // console.log(ModelData);

      // 1：添加节点 ；[x,x]添加到哪一层 ; 节点key； 名称
      ModelData[parent].components.push(uniqueId);
      onChange([1, parent, uniqueId, ModelData[uniqueId].name, 'Model', ModelData[uniqueId].icon]);
      return uniqueId;
    })
    .catch(err => {
      console.log(err);
    });
}
const removeModel3 = (key) => {
  if (ModelData[key] != null) {
    global.renderer.removeActor(ModelData[key].actor);
  }
}
const showAxes = () => {

}
// ================================================================================ navBar toolBtn
const JsonToString = obj => JSON.stringify(obj);
const StringToJSON = str => {
  return JSON.parse(str);
}
const downLoadFile = (file, name) => {
  let url = window.URL.createObjectURL(new Blob([file]));
  let link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); // 下载完成移除元素
  window.URL.revokeObjectURL(url); // 释放掉blob对象
}
const saveFile = () => {
  downLoadFile("", "");
}
const BoolDlg = (mode) => {
  EventBus.emit("LeftBar-open", ['BoolBar', mode]);
}
const resetActor = () => {
  if (global.activeActor) {
    global.activeActor.getProperty().setColor(global.activeColor);
    global.activeActor = null;
    global.renderWindow.render();
  }
}
const ChooseActor = (actor) => {
  if (actor) {
    global.activeActor = actor;
    global.activeColor = global.activeActor.getProperty().getColor();
    actor.getProperty().setColor(1, 0, 0);
    global.renderWindow.render();
  }
}
const findDataByActor = (actor) => {
  console.log(actor);
  console.log(ModelData);

  for (let prop in ModelData) {
    const data = ModelData[prop];
    if (actor === data.actor) {
      return data;
    }
  }

  return null;
}
EventBus.on('createBool', val => {
  createModel3('布尔体', val.target.parent, val);
})
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
      createModel3(val[1]);
      break;
    case '直接草图':
      break;
    case '布尔运算':
      BoolDlg(val[1]);

    default:
      break;
  }
})
//
onMounted(() => {
  // 生成window
  fullScreenRenderer.value = vtkFullScreenRenderWindow.newInstance({
    background: [0.1, 0.1, 0.9],
    container: sectionRef.value,
  });
  global.renderer = fullScreenRenderer.value.getRenderer();
  global.camera = global.renderer.getActiveCamera();
  global.renderWindow = fullScreenRenderer.value.getRenderWindow();
  global.interactor = fullScreenRenderer.value.getInteractor();
  // global.interactorStyle = global.interactor.getInteractorStyle();
  global.picker = vtkPicker.newInstance();
  global.interactor.setPicker(global.picker);

  // 设置背景
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

  global.interactor.onMouseMove((e) => {
    // console.log(e.position);
    global.picker.pick([e.position.x, e.position.y, 0], global.renderer);
    // global.picker.pick3DPoint([0,0, 12],[0,0,-12], global.renderer);
    // console.log(global.picker.getActors());

    resetActor();
    if (global.picker.getActors().length)
      ChooseActor(global.picker.getActors()[0]);
  });
  global.interactor.onLeftButtonPress((e) => {
    EventBus.emit("pickActor", findDataByActor(global.activeActor));
  })

  //
  global.renderer.resetCamera();
  global.renderWindow.render();
  sendCamerainfo();
  //
  logLightsInfo();
});
defineExpose({
  fullScreenRenderer,
  createModel3
});
</script>


<style scoped>
div {
  margin: 3px;
  background-color: #000;
  /* border: 1px solid #ccc */
}
</style>
