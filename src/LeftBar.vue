<script setup>
import Components from './components/LeftBar/Components.vue'
import CameraControl from './components/LeftBar/CameraControl.vue'
import BoolBar from './components/LeftBar/BoolBar.vue'
import EventBus from './assets/common/event-bus';
import { picker, view } from './assets/common/tools/LeftBarTools';
import { ref } from 'vue';

const isShow = ref({
    "BoolBar": false,
})
const btns = ['home', 'profile', 'history', 'bool'];
const btnRef = {
    "HomeBar": 0,
    "BoolBar": 3,
}
const clickBtn = (name) => {
    document.querySelector('#' + 'v-pills-' + btns[btnRef[name]] + '-tab').click();
}
EventBus.on('LeftBar-close', (val) => {
    isShow.value[val] = false;
    clickBtn('HomeBar');
})
const boolType = ref('交运算');
EventBus.on('LeftBar-open', (val) => {
    isShow.value[val[0]] = true;
    // 切换到对应tab
    clickBtn(val[0]);
})


const open = ref(false);
const ModalTitle = ref('');
const ModalData = ref([]);
EventBus.on('LeftBar-Modal-open', (val) => {
    open.value = true;
    ModalTitle.value = val[0];

    if (val.length > 1)
        ModalData.value = val[1];
})
const handleOk = e => {
    console.log(e);
    open.value = false;
};
const InfoChanged = (val) => {
    if (val == 'Rotate') {
        EventBus.emit("Property-changed", [val, ModalData.value]);
    } else
        EventBus.emit("Property-changed", val);
}
const pickerId = ref(0);
const viewId = ref(0);
const toolTrigger = (id) => {
    // console.log(id);
    if (id < 4)
        pickerId.value = id;
    else if (id < 10)
        viewId.value = id;
    EventBus.emit('tools-trigger', id);
}
</script>

<template>
    <section>
        <div class="tools">
            <a-button-group>
                <a-button :type="btn.toolId == pickerId ? 'primary' : 'default'" v-for="btn in picker" :key="btn.toolId"
                    :class="'iconfont ' + btn.icon" size="small" @click="toolTrigger(btn.toolId)">
                </a-button>
            </a-button-group>
            <div style="flex: 1;"></div>
            <a-button-group>
                <a-button :type="btn.toolId == viewId ? 'primary' : 'default'" v-for="btn in view" :key="btn.toolId"
                    :class="'iconfont ' + btn.icon" size="small" @click="toolTrigger(btn.toolId)">
                </a-button>
            </a-button-group>
        </div>
        <nav class="d-flex align-items-start">
            <div class="nav flex-column nav-pills me-3" id="v-pills-tab" style="margin-right: 0 !important;"
                role="tablist" aria-orientation="vertical">
                <button :class="'icon-icon iconfont nav-link active'" id="v-pills-home-tab" data-bs-toggle="pill"
                    data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home"
                    aria-selected="true"></button>
                <button class="icon-icon_shexiangji iconfont nav-link" id="v-pills-profile-tab" data-bs-toggle="pill"
                    data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile"
                    aria-selected="false"></button>
                <button class="icon-lishijilu iconfont nav-link" id="v-pills-history-tab" data-bs-toggle="pill"
                    data-bs-target="#v-pills-history" type="button" role="tab" aria-controls="v-pills-history"
                    aria-selected="false"></button>
                <button :hidden="!isShow['BoolBar']" class="icon-bueryunsuan iconfont nav-link" id="v-pills-bool-tab"
                    data-bs-toggle="pill" data-bs-target="#v-pills-bool" type="button" role="tab"
                    aria-controls="v-pills-bool" aria-selected="false"></button>
            </div>
            <div class="tab-content" id="v-pills-tabContent">
                <!-- // 组件控制器 -->
                <div class="h_control tab-pane fade show active" id="v-pills-home" role="tabpanel"
                    aria-labelledby="v-pills-home-tab" tabindex="0">
                    <Components />
                </div>
                <!-- // 视角 -->
                <div class="h_control tab-pane fade" id="v-pills-profile" role="tabpanel"
                    aria-labelledby="v-pills-profile-tab" tabindex="0">
                    <CameraControl />
                </div>
                <!-- // 历史记录 -->
                <div class="h_control tab-pane fade" id="v-pills-history" role="tabpanel"
                    aria-labelledby="v-pills-history-tab" tabindex="0">...</div>
                <!-- 布尔运算 -->
                <div :hidden="!isShow['BoolBar']" class="h_control tab-pane fade" id="v-pills-bool" role="tabpanel"
                    aria-labelledby="v-pills-bool-tab" tabindex="0">
                    <BoolBar :booltype="boolType" />
                </div>

                <!-- 伸缩、旋转 -->
                <div>
                    <a-modal v-model:open="open" :title="ModalTitle" @ok="handleOk">
                        <!-- 伸缩 -->
                        <a-form-item label="伸缩" v-if="ModalTitle == 'Scale'" style="margin-left: 14px;">
                            <a-input-number v-for="i in [0, 1, 2]" :key="i" v-model:value="ModalData[i]" :step="0.01"
                                :min="0" style="width: 57px; margin-left: 5px" @change="InfoChanged('Scale')" />
                        </a-form-item>
                        <!-- 旋转 -->
                        <template v-else-if="ModalTitle == 'Rotate'">
                            <a-form-item label="轴" style="margin-left: 14px;">
                                <a-input-number v-for="i in [0, 1, 2]" :key="i" v-model:value="ModalData[i]"
                                    :step="0.01" style="width: 57px; margin-left: 5px"
                                    @change="InfoChanged('Rotate')" />
                                <a-button-group style="margin-left: 20px;">
                                    <a-button type="primary"
                                        v-for="item in [['X轴', [1, 0, 0]], ['Y轴', [0, 1, 0]], ['Z轴', [0, 0, 1]]]"
                                        :key="item[0]"
                                        @click="ModalData[0] = item[1][0]; ModalData[1] = item[1][1]; ModalData[2] = item[1][2]; InfoChanged('Rotate');">
                                        {{ item[0] }}
                                    </a-button>
                                </a-button-group>
                            </a-form-item>
                            <a-form-item label="点" style="margin-left: 14px;">
                                <a-input-number v-for="i in [3, 4, 5]" :key="i" v-model:value="ModalData[i]"
                                    :step="0.01" style="width: 57px; margin-left: 5px"
                                    @change="InfoChanged('Rotate')" />
                            </a-form-item>
                            <a-form-item label="角度(°)" style="margin-left: 14px;">
                                <a-input-number v-model:value="ModalData[6]" :step="0.01"
                                    style="width: 57px; margin-left: 5px" @change="InfoChanged('Rotate')" />
                                <a-button-group style="margin-left: 20px;">
                                    <a-button v-for="item in [[0, 45], [1, 90], [2, 180], [3, 360]]" :key="item[0]"
                                        type="primary" @click="ModalData[6] = item[1]; InfoChanged('Rotate');">
                                        {{ item[1] }}°
                                    </a-button>
                                </a-button-group>
                            </a-form-item>
                        </template>
                    </a-modal>
                </div>
            </div>
        </nav>
    </section>
</template>


<style scoped>
.tools {
    display: flex;
    margin-bottom: 3px;
}

section {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

nav {
    width: 100%;
    flex: 1;
    height: 0;
}

#v-pills-tabContent {
    flex: 1;
    width: 0;
    height: 100%;
    background-color: #f1f1f1;
}

button {
    --bs-nav-pills-link-active-bg: #f1f1f1;
    border-radius: 0 !important;
}

.h_control {
    width: 100%;
    height: 100%;
}

.left_container {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 3px;
    padding: 3px;
}
</style>