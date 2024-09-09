<script setup>
import { ref } from 'vue';
import EventBus from '@/assets/common/event-bus';
import { message } from 'ant-design-vue';

const closeTab = () => EventBus.emit("LeftBar-close", 'BoolBar');

const handleBoolTypeChange = () => {

}
EventBus.on('pick-actor-bool', data => {
    if (ChooseWhere.value == 0) {
        data = data || { name: '', key: '' };
        targetModel.value = data;
    } else {
        if (data && !toolModelsRef.value[data.key]) {
            toolModelsRef.value[data.key] = data;
            toolModels.value.push(data);
        }
    }
})
const deleteElem = key => {
    toolModels.value.forEach((item, i) => {
        if (item.key == key) {
            toolModels.value.splice(i, 1);
            toolModelsRef.value[key] = null;
        }
    })
}
const changeChooseWhere = where => ChooseWhere.value = where;

const boolType = ref('交运算');
const ChooseWhere = ref(0);
const targetModel = ref({ name: '', key: '' });
const toolModels = ref([]);
const toolModelsRef = ref({});

const generateBool = () => {
    if (targetModel.value.key == '') {
        message.error('目标体不能为空');
        return;
    }
    if (toolModels.value.length == 0) {
        message.error('工具体不能为空');
        return;
    }
    EventBus.emit('createBool', {
        boolType: boolType.value,
        target: targetModel.value,
        tools: toolModels.value,
    })
    targetModel.value = { name: '', key: '' };
    toolModels.value = [];
    ChooseWhere.value = 0;
}
</script>
<template>
    <div class="left_container">
        <div>
            <span class="head_title">布尔运算</span>
            <!-- <a-button type="primary" danger @click="closeTab">关闭</a-button>
            <a-button type="primary" @click="closeTab">生成布尔体</a-button> -->
            <a-button-group>
                <a-button @click="closeTab" type="primary" danger>关闭</a-button>
                <a-button @click="generateBool" type="primary">生成布尔体</a-button>
            </a-button-group>
        </div>
        <p class="head_title">类型</p>
        <section>
            <a-select ref="select" v-model:value="boolType" style="width: 100%" @change="handleBoolTypeChange">
                <a-select-option value="交运算">交运算</a-select-option>
                <a-select-option value="差运算">差运算</a-select-option>
                <a-select-option value="并运算">并运算</a-select-option>
            </a-select>
        </section>
        <p class="head_title">目标体</p>
        <section>
            <a-input-search v-model:value="targetModel.name" placeholder="" size="large" @search="onSearch">
                <template #enterButton>
                    <a-button type="primary" @click="changeChooseWhere(0)">选择</a-button>
                </template>
            </a-input-search>
        </section>
        <p class="head_title">工具体</p>
        <section>
            <a-button type="primary" @click="changeChooseWhere(1)"
                style="width: 100%;margin-bottom: 10px;">选择</a-button>
            <a-list size="small" bordered :data-source="toolModels">
                <template #renderItem="{ item }">
                    <a-list-item>{{ item.name }}
                        <a-button type="primary" danger @click="deleteElem(item.key)">删除</a-button>
                    </a-list-item>
                </template>
            </a-list>
        </section>
    </div>
</template>



<style scoped>
.left_container {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 3px;
    padding: 3px;
}

section {
    background-color: #fff;
    border: 1px solid #aaa;
    width: 100%;
    min-height: 60px;
    padding: 7px;
    overflow: auto;
}

.head_title {
    padding: 0px;
    margin: 0 10px 0 0;
    font-weight: bold;
}

.box_item {
    display: flex;
    flex-direction: row;
    gap: 10px;
}
</style>