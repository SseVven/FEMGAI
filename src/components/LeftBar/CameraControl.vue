<script setup>
import { camelize, ref } from 'vue';
import EventBus from '@/assets/common/event-bus';
// const showLine = ref(true);
const showIcon = ref(false);
const treeData = ref([
    {
        title: '基础视角',
        key: '0',
        children: [
            {
                changeable: true,
                key: '0-0',
                title: 'MyCamera',
                modelIndex: 0,
                startPos: [0, 0, 1],
                focus: [0, 0, 0],
                viewUp: [0, 1, 0],
                viewAngle: 30.0,
                midPoses: [],
                endPos: [],
                times: [],
                recycle: false,
            },
            {
                changeable: false,
                key: '0-1',
                title: '正视角',
                modelIndex: 1,
                startPos: [0, 0, 1],
                focus: [0, 0, 0],
                viewUp: [0, 1, 0],
                viewAngle: 30.0,
                midPoses: [],
                endPos: [],
                times: [],
                recycle: false,
            },
            {
                changeable: false,
                key: '0-2',
                title: '后视角',
                modelIndex: 1,
                startPos: [0, 0, -1],
                focus: [0, 0, 0],
                viewUp: [0, 1, 0],
                viewAngle: 30.0,
                midPoses: [],
                endPos: [],
                times: [],
                recycle: false,
            },
            {
                changeable: false,
                key: '0-3',
                title: '上视角',
                modelIndex: 1,
                startPos: [0, 1, 0],
                focus: [0, 0, 0],
                viewUp: [0, 0, -1],
                viewAngle: 30.0,
                midPoses: [],
                endPos: [],
                times: [],
                recycle: false,
            },
            {
                changeable: false,
                key: '0-4',
                title: '下视角',
                modelIndex: 1,
                startPos: [0, -1, 0],
                focus: [0, 0, 0],
                viewUp: [0, 0, 1],
                viewAngle: 30.0,
                midPoses: [],
                endPos: [],
                times: [],
                recycle: false,
            },
            {
                changeable: false,
                key: '0-5',
                title: '左视角',
                modelIndex: 1,
                startPos: [-1, 0, 0],
                focus: [0, 0, 0],
                viewUp: [0, 1, 0],
                viewAngle: 30.0,
                midPoses: [],
                endPos: [],
                times: [],
                recycle: false,
            },
            {
                changeable: false,
                key: '0-6',
                title: '右视角',
                modelIndex: 1,
                startPos: [1, 0, 0],
                focus: [0, 0, 0],
                viewUp: [0, 1, 0],
                viewAngle: 30.0,
                midPoses: [],
                endPos: [],
                times: [],
                recycle: false,
            },
        ],
    },
    {
        title: '特殊视角',
        key: '1',
        children: [
            {
                key: '1-0',
                title: 'parent 2-0',
                startPos: [0, 0, 10],
                focus: [0, 0, 0],
                viewUp: [0, 1, 0],
                viewAngle: 30,
                midPoses: [],
                endPos: [],
                times: [],
                recycle: false,
            },
        ],
    },
]);
const findNode = (key) => {
    const myque = [];
    for (let i = 0; i < treeData.value.length; i++) {
        myque.push(treeData.value[i]);
    }
    while (myque.length != 0) {
        let node = myque[0];
        if (node.key == key) {
            return node;
        }
        myque.shift();
        if ('children' in node)
            for (let i = 0; i < node.children.length; i++)
                myque.push(node.children[i]);
    }
    return null;
}
const useCamera = () => {
    const temp = CameraChoosed.value;
    // console.log('"camera-choose":', CameraChoosed);
    EventBus.emit("camera-choose", [temp.modelIndex, {
        Position: [temp.startPos[0], temp.startPos[1], temp.startPos[2]],
        FocalPoint: [temp.focus[0], temp.focus[1], temp.focus[2]],
        ViewUp: [temp.viewUp[0], temp.viewUp[1], temp.viewUp[2]],
        ViewAngle: temp.viewAngle,
    }])
}
const onSelect = (selectedKeys, info, useable = true) => {
    if ('node' in info)
        info = info.node;
    if ('children' in info)
        return;
    const temp = CameraChoosed.value;
    temp.changeable = info.changeable || false;
    temp.key = info.key || "";
    temp.title = info.title || "";
    temp.modelIndex = info.modelIndex || 0;
    temp.startPos[0] = info.startPos[0];
    temp.startPos[1] = info.startPos[1];
    temp.startPos[2] = info.startPos[2];
    temp.focus = info.focus || [];
    temp.viewUp = info.viewUp || [];
    temp.viewAngle = info.viewAngle || 30.0;
    // temp.midPoses = info.midPoses || [];
    // temp.endPos = info.endPos || [];
    // temp.times = info.times || [];
    // temp.recycle = info.recycle || false;
    if (useable)
        useCamera();
};
//接收信息
EventBus.on('camera-info', (val) => {
    // console.log("camera-info:", val);
    for (let i = 0; i < 3; i++)
        treeData.value[0].children[0].startPos[i] = typeof (val.Position[i]) == 'string' ? val.Position[i] : val.Position[i].toFixed(3);
    for (let i = 0; i < 3; i++)
        treeData.value[0].children[0].focus[i] = typeof (val.FocalPoint[i]) == 'string' ? val.FocalPoint[i] : val.FocalPoint[i].toFixed(3);
    for (let i = 0; i < 3; i++)
        treeData.value[0].children[0].viewUp[i] = typeof (val.ViewUp[i]) == 'string' ? val.ViewUp[i] : val.ViewUp[i].toFixed(3);
    treeData.value[0].children[0].viewAngle = typeof (val.ViewAngle) == 'string' ? val.ViewAngle : val.ViewAngle.toFixed(3);
    onSelect('0-0', treeData.value[0].children[0], false);
});
const changeCameraInfo = (val) => {
    const temp = CameraChoosed.value[val];
    // console.log("camera key:", CameraChoosed.value.key);
    const node = findNode(CameraChoosed.value.key);
    if (temp instanceof Array)
        for (let i = 0; i < temp.length; i++)
            node[val][i] = temp[i];
    else
        node[val] = temp;

    // 改变了之后改变 camera
    useCamera();
}
const CameraChoosed = ref({
    key: "0",
    title: "name",
    modelIndex: 1,
    startPos: [0, 0, 0],
    focus: [],
    viewUp: [],
    viewAngle: 30,
    midPoses: [],
    endPos: [],
    times: [],
    recycle: false,
})

</script>
<template>
    <div class="left_container">
        <p class="head_title">摄像机控制</p>
        <section style="flex: 1;display: flex;flex-direction: column;overflow: auto;">
            <div style="flex: 1;overflow: auto;">
                <a-tree :defaultExpandAll="true" :show-line="true" :show-icon="showIcon" :tree-data="treeData"
                    @select="onSelect" @rightClick="console.log('r cluick')">
                    <template #title="{ dataRef }">
                        <template v-if="!('modelIndex' in dataRef)">
                            <div style="width: 100%">{{ dataRef.title }}
                                <button class="btn iconfont icon-add"></button>
                            </div>
                        </template>
                        <template v-else>
                            {{ dataRef.title }}
                        </template>
                    </template>
                    <template #switcherIcon="">
                        <i class="iconfont icon-icon_shexiangji"></i>
                    </template>
                </a-tree>
            </div>
        </section>
        <p class="head_title">摄像机设置</p>
        <section>
            <div class="box_item">
                <a-form-item label="相机名称">
                    <a-input v-model:value="CameraChoosed.title" />
                </a-form-item>
                <a-button style="flex: 1;" type="primary" @click="changeCameraInfo('title')">应用</a-button>
            </div>
            <div class="box_item">
                <span style="width:60px;">位置:</span>
                <a-input-number :disabled="!CameraChoosed.changeable" :step="0.1"
                    v-model:value="CameraChoosed.startPos[0]" @change="changeCameraInfo('startPos')" />
                <a-input-number :disabled="!CameraChoosed.changeable" :step="0.1"
                    v-model:value="CameraChoosed.startPos[1]" @change="changeCameraInfo('startPos')" />
                <a-input-number :disabled="!CameraChoosed.changeable" :step="0.1"
                    v-model:value="CameraChoosed.startPos[2]" @change="changeCameraInfo('startPos')" />
            </div>
            <div class="box_item">
                <span style="width:60px;">焦点:</span>
                <a-input-number :disabled="!CameraChoosed.changeable" :step="0.1" v-model:value="CameraChoosed.focus[0]"
                    @change="changeCameraInfo('focus')" />
                <a-input-number :disabled="!CameraChoosed.changeable" :step="0.1" v-model:value="CameraChoosed.focus[1]"
                    @change="changeCameraInfo('focus')" />
                <a-input-number :disabled="!CameraChoosed.changeable" :step="0.1" v-model:value="CameraChoosed.focus[2]"
                    @change="changeCameraInfo('focus')" />
            </div>
            <div class="box_item">
                <span style="width:60px;">仰角:</span>
                <a-input-number :disabled="!CameraChoosed.changeable" :step="0.1"
                    v-model:value="CameraChoosed.viewUp[0]" @change="changeCameraInfo('viewUp')" />
                <a-input-number :disabled="!CameraChoosed.changeable" :step="0.1"
                    v-model:value="CameraChoosed.viewUp[1]" @change="changeCameraInfo('viewUp')" />
                <a-input-number :disabled="!CameraChoosed.changeable" :step="0.1"
                    v-model:value="CameraChoosed.viewUp[2]" @change="changeCameraInfo('viewUp')" />
            </div>
            <div class="box_item">
                <span style="width:55px;">张角:</span>
                <a-input-number :disabled="!CameraChoosed.changeable" :step="0.1"
                    v-model:value="CameraChoosed.viewAngle" @change="changeCameraInfo('viewAngle')" />
            </div>
            <a-divider>动效控制</a-divider>
        </section>
    </div>
</template>



<style scoped>
.left_container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    gap: 3px;
    padding: 3px;
}

section {
    width: 100%;
    overflow: auto;
    background-color: #fff;
    border: 1px solid #aaa;
    padding: 3px;
}

.head_title {
    padding: 0px;
    margin: 0;
    font-weight: bold;
}

.box_item {
    display: flex;
    flex-direction: row;
    gap: 10px;
}
</style>