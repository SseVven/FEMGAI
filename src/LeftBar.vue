<script setup>
import Components from './components/LeftBar/Components.vue'
import CameraControl from './components/LeftBar/CameraControl.vue'
import BoolBar from './components/LeftBar/BoolBar.vue'
import EventBus from './assets/common/event-bus';
import { ref, vModelDynamic } from 'vue';

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
</script>

<template>
    <nav class="d-flex align-items-start">
        <div class="nav flex-column nav-pills me-3" id="v-pills-tab" style="margin-right: 0 !important;" role="tablist"
            aria-orientation="vertical">
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

            <div>
                <a-modal v-model:open="open" :title="ModalTitle" @ok="handleOk">
                    <a-form-item label="伸缩" v-if="ModalTitle == 'Scale'" style="margin-left: 14px;">
                        <a-input-number v-model:value="ModalData[0]" :step="0.01" :min="0"
                            style="width: 57px; margin-left: 5px" @change="InfoChanged('Scale')" />
                        <a-input-number v-model:value="ModalData[1]" :step="0.01" :min="0"
                            style="width: 57px; margin-left: 5px" @change="InfoChanged('Scale')" />
                        <a-input-number v-model:value="ModalData[2]" :step="0.01" :min="0"
                            style="width: 57px; margin-left: 5px" @change="InfoChanged('Scale')" />
                    </a-form-item>
                    <template v-else-if="ModalTitle == 'Rotate'">
                        <a-form-item label="轴" style="margin-left: 14px;">
                            <a-input-number v-model:value="ModalData[0]" :step="0.01"
                                style="width: 57px; margin-left: 5px" @change="InfoChanged('Rotate')" />
                            <a-input-number v-model:value="ModalData[1]" :step="0.01"
                                style="width: 57px; margin-left: 5px" @change="InfoChanged('Rotate')" />
                            <a-input-number v-model:value="ModalData[2]" :step="0.01"
                                style="width: 57px; margin-left: 5px" @change="InfoChanged('Rotate')" />
                            <a-button-group style="margin-left: 20px;">
                                <a-button type="primary"
                                    @click="ModalData[0] = 1; ModalData[1] = 0; ModalData[2] = 0; InfoChanged('Rotate');">X轴</a-button>
                                <a-button type="primary"
                                    @click="ModalData[0] = 0; ModalData[1] = 1; ModalData[2] = 0; InfoChanged('Rotate');">Y轴</a-button>
                                <a-button type="primary"
                                    @click="ModalData[0] = 0; ModalData[1] = 0; ModalData[2] = 1; InfoChanged('Rotate');">Z轴</a-button>
                            </a-button-group>
                        </a-form-item>
                        <a-form-item label="点" style="margin-left: 14px;">
                            <a-input-number v-model:value="ModalData[3]" :step="0.01"
                                style="width: 57px; margin-left: 5px" @change="InfoChanged('Rotate')" />
                            <a-input-number v-model:value="ModalData[4]" :step="0.01"
                                style="width: 57px; margin-left: 5px" @change="InfoChanged('Rotate')" />
                            <a-input-number v-model:value="ModalData[5]" :step="0.01"
                                style="width: 57px; margin-left: 5px" @change="InfoChanged('Rotate')" />
                        </a-form-item>
                        <a-form-item label="角度(°)" style="margin-left: 14px;">
                            <a-input-number v-model:value="ModalData[6]" :step="0.01"
                                style="width: 57px; margin-left: 5px" @change="InfoChanged('Rotate')" />
                            <a-button-group style="margin-left: 20px;">
                                <a-button type="primary"
                                    @click="ModalData[6] = 45; InfoChanged('Rotate');">45°</a-button>
                                <a-button type="primary"
                                    @click="ModalData[6] = 90; InfoChanged('Rotate');">90°</a-button>
                                <a-button type="primary"
                                    @click="ModalData[6] = 180; InfoChanged('Rotate');">180°</a-button>
                            </a-button-group>
                        </a-form-item>
                    </template>
                </a-modal>
            </div>
        </div>
    </nav>
</template>


<style scoped>
nav {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin: 3px;
}

#v-pills-tabContent {
    flex: 1;
    height: 100%;
    width: 0;
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

.head_title {
    /* margin: 3px; */
}

section {
    /* margin: 3px; */
}
</style>