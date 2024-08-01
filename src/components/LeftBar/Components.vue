<script setup>
import { ref } from 'vue';
import EventBus from '@/assets/common/event-bus';
// const showLine = ref(true);
const showIcon = ref(false);
const treeData = ref([

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
const controlTreeNode = (mode, val) => {
    if (mode == 0) {
        // console.log(ModelPropertyInfo.value.key, val);
        findNode(ModelPropertyInfo.value.key)[val[0]] = val[1];
    }
}
const InfoChanged = (property) => {
    EventBus.emit("Property-changed", [ModelPropertyInfo.value.key, property]);

    // if (property == 'color')
    //     ModelPropertyInfo.value.actor.getProperty().setColor(ModelPropertyInfo.value.property.color);
}
const onSelect = (selectedKeys, info) => {
    // console.log('selected', selectedKeys, info);
    // 把节点的key丢过去，返回节点的信息回来
    if (selectedKeys.length > 0)
        EventBus.emit("component-node-query", [selectedKeys[0], info.node.type]);
};
const ModelPropertyInfo = ref({
});
EventBus.on('component-node-queryRes', (val) => {
    // console.log("component-node-queryRes", val);
    ModelPropertyInfo.value = val;
    // ModelPropertyInfo.value.name = "2131"
})
const ExpandKey = ref([]);
// 接收信息 对组件控制器的修改信息
EventBus.on('dataStructChange', (val) => {
    // console.log("dataStructChange:", val);
    switch (val[0]) {
        // 初始化
        case 0:
            treeData.value = val[1];
            break;
        // 新增
        case 1:
            let node = findNode(val[1])

            if (!('children' in node))
                node.children = [];
            node.children.push({
                title: val[3],
                key: val[2],
                type: val[4],
                icon: val[5],
                parent: val[1],
            })
            ExpandKey.value.push(val[1])
            break;
        default:
            break;
    }
})
//
const addComponent = (dataRef, modeIndex, modelIndex = 0) => {
    // console.log('add file', dataRef, modeIndex, modelIndex);
    //  发送请求，根据回执添加在 treeData
    EventBus.emit("component-add-query", [dataRef.key, modeIndex, modelIndex]);
};
const removeComponent = (key) => {
    // console.log('remove file', key);
    const parentKey = findNode(key).parent;
    if(parentKey){
        //  发送请求，根据回执添加在 treeData
        EventBus.emit("component-remove-query", key);

        const ParentNode = findNode(parentKey);
        for(let i =0;i<ParentNode.children.length;i++){
            if(ParentNode.children[i].key == key){
                ParentNode.children.splice(i, 1);
                break;
            }
        }
    }
};
//
const activeKey = ref([2]);
const CenterStep = ref("0.01");
</script>
<template>
    <div class="left_container">
        <p class="head_title">组件控制器</p>
        <section style="flex: 1;display: flex;flex-direction: column;overflow: auto;">
            <!-- <div style="padding: 4px;border-bottom: 1px solid #ccc;">
                showIcon:
                <a-switch v-model:checked="showIcon" />
            </div> -->
            <div style="flex: 1;overflow: auto;">
                <a-tree :show-line="true" :show-icon="showIcon" :tree-data="treeData" v-model:expandedKeys="ExpandKey"
                    @select="onSelect">
                    <template #title="{ dataRef }">
                        <!-- <template v-if="dataRef.key === '0-0-0-1'">
                            <div>multiple line title</div>
                            <div>multiple line title</div>
                        </template> -->

                        <div style="display: flex; gap: 10px; height: 32px; align-items: center;">
                            <span style="line-height: 32px;" :class="'iconfont ' + dataRef.icon">
                                {{ " " + dataRef.title }}
                            </span>
                            <a-button-group>
                                <a-dropdown v-if="dataRef.type != 'Model'">
                                    <template #overlay>
                                        <a-menu>
                                            <a-menu-item key="1" @click="addComponent(dataRef, 2)">
                                                <span class="iconfont icon-bujian">&nbsp;组件</span>
                                            </a-menu-item>
                                            <a-menu-item key="2">
                                                <a-dropdown v-if="dataRef.type != 'Model'">
                                                    <template #overlay>
                                                        <a-menu>
                                                            <a-menu-item key="2-1" @click="addComponent(dataRef, 1, 0)">
                                                                <span class="iconfont icon-m_ac_set">&nbsp;立方体</span>
                                                            </a-menu-item>
                                                            <a-menu-item key="2-2" @click="addComponent(dataRef, 1, 1)">
                                                                <span class="iconfont icon-yuanzhuiti">&nbsp;圆锥</span>
                                                            </a-menu-item>
                                                            <a-menu-item key="2-3" @click="addComponent(dataRef, 1, 2)">
                                                                <span class="iconfont icon-cylinder">&nbsp;圆柱体</span>
                                                            </a-menu-item>
                                                            <a-menu-item key="2-4" @click="addComponent(dataRef, 1, 3)">
                                                                <span class="iconfont icon-fi-sr-sphere">&nbsp;球体</span>
                                                            </a-menu-item>
                                                        </a-menu>
                                                    </template>
                                                    <span class="iconfont icon-m_ac_set">&nbsp;模型&nbsp;<i
                                                            class="iconfont icon-jiantouxia"></i></span>
                                                </a-dropdown>
                                            </a-menu-item>
                                        </a-menu>
                                    </template>
                                    <a-button @click.stop="" style="height: 24px;padding:0 7px;line-height: 22px;">
                                        +
                                    </a-button>
                                </a-dropdown>

                                <a-button @click.stop="removeComponent(dataRef.key);" style="height: 24px;padding:0 7px;line-height: 22px;" danger
                                    type="primary">-</a-button>
                            </a-button-group>
                        </div>
                    </template>
                </a-tree>
            </div>
        </section>
        <p class="head_title">详细信息</p>
        <section>
            <div class="box_item">
                <span style="padding-left: 10px; width:60px;line-height: 32px;">名称:</span>
                <a-input style="height: 32px;" v-model:value="ModelPropertyInfo.name"
                    @change="controlTreeNode(0, ['title', ModelPropertyInfo.name])" />
            </div>
            <div class="box_item">
                <span style="padding-left: 10px; line-height: 32px;">类别:</span>
                <span style="line-height: 32px;">{{ ModelPropertyInfo.type }}</span>
                <span style="padding-left: 20px; line-height: 32px;">模型类别:</span>
                <span :class="'iconfont ' + ModelPropertyInfo.icon" style="line-height: 32px;">{{
                    ModelPropertyInfo.model_type
                    }}</span>
            </div>
            <a-collapse v-model:activeKey="activeKey" accordion>
                <a-collapse-panel key="1" header="属性"
                    v-if="ModelPropertyInfo.type == 'Model' && 'property' in ModelPropertyInfo">
                    <a-list size="small">
                        <a-list-item>颜色：
                            <a-row>
                                <a-col :span="7">
                                    <a-input-number v-model:value="ModelPropertyInfo.property.color[0]"
                                        style="margin-left: 16px;width: 70px;" :min="0" :max="1" :step="0.01"
                                        @change="InfoChanged('color')" />
                                </a-col>
                                <a-col :span="7">
                                    <a-input-number v-model:value="ModelPropertyInfo.property.color[1]"
                                        style="margin-left: 16px;width: 70px;" :min="0" :max="1" :step="0.01"
                                        @change="InfoChanged('color')" />
                                </a-col>
                                <a-col :span="7">
                                    <a-input-number v-model:value="ModelPropertyInfo.property.color[2]"
                                        style="margin-left: 16px;width: 70px;" :min="0" :max="1" :step="0.01"
                                        @change="InfoChanged('color')" />
                                </a-col>
                            </a-row>
                        </a-list-item>
                        <a-list-item>透明度：
                            <a-row>
                                <a-col :span="12">
                                    <a-slider v-model:value="ModelPropertyInfo.property.opacity" :min="0" :max="1"
                                        :step="0.01" style="margin-left: 16px" @change="InfoChanged('opacity')" />
                                </a-col>
                                <a-col :span="4">
                                    <a-input-number v-model:value="ModelPropertyInfo.property.opacity" :min="0" :max="1"
                                        :step="0.01" style="margin-left: 16px" @change="InfoChanged('opacity')" />
                                </a-col>
                            </a-row>
                        </a-list-item>
                    </a-list>
                </a-collapse-panel>
                <a-collapse-panel key="2" header="参数"
                    v-if="ModelPropertyInfo.type == 'Model' && 'params' in ModelPropertyInfo">
                    <a-list size="small">
                        <a-list-item>位置：
                            <a-select ref="select" v-model:value="CenterStep" style="width: 120px;">
                                <a-select-option value="0.01">0.01</a-select-option>
                                <a-select-option value="0.1">0.1</a-select-option>
                                <a-select-option value="1">1</a-select-option>
                            </a-select>
                            <a-row>
                                <a-col :span="8">
                                    <a-input-number v-model:value="ModelPropertyInfo.params.center[0]"
                                        style="margin-left: 16px;width: 80px;" :step="Number(CenterStep)"
                                        @change="InfoChanged('params')" />
                                </a-col>
                                <a-col :span="8">
                                    <a-input-number v-model:value="ModelPropertyInfo.params.center[1]"
                                        style="margin-left: 16px;width: 80px;" :step="Number(CenterStep)"
                                        @change="InfoChanged('params')" />
                                </a-col>
                                <a-col :span="8">
                                    <a-input-number v-model:value="ModelPropertyInfo.params.center[2]"
                                        style="margin-left: 16px;width: 80px;" :step="Number(CenterStep)"
                                        @change="InfoChanged('params')" />
                                </a-col>
                            </a-row>
                        </a-list-item>
                        <a-list-item v-if="'resolution' in ModelPropertyInfo.params">分辨率：
                            <a-row>
                                <a-col :span="12">
                                    <a-slider v-model:value="ModelPropertyInfo.params.resolution" :min="0" :max="300"
                                        :step="1" style="margin-left: 16px" @change="InfoChanged('params')" />
                                </a-col>
                                <a-col :span="4">
                                    <a-input-number v-model:value="ModelPropertyInfo.params.resolution" :min="0"
                                        :max="300" :step="1" style="margin-left: 16px"
                                        @change="InfoChanged('params')" />
                                </a-col>
                            </a-row>
                        </a-list-item>
                        <a-list-item>模型参数：
                            <a-form-item label="半径" v-if="'radius' in ModelPropertyInfo.params"
                                style="margin-left: 14px;">
                                <a-input-number v-model:value="ModelPropertyInfo.params.radius" :min="0" :step="0.01"
                                    style="margin-left: 16px" @change="InfoChanged('params')" />
                            </a-form-item>
                            <a-form-item label="高度" v-if="'height' in ModelPropertyInfo.params"
                                style="margin-left: 14px;">
                                <a-input-number v-model:value="ModelPropertyInfo.params.height" :step="0.01"
                                    style="margin-left: 16px" @change="InfoChanged('params')" />
                            </a-form-item>
                            <a-form-item label="朝向" v-if="'direct' in ModelPropertyInfo.params"
                                style="margin-left: 14px;">
                                <a-input-number v-model:value="ModelPropertyInfo.params.direct[0]" :step="0.01"
                                    :min="-1" :max="1" style="width: 57px; margin-left: 5px"
                                    @change="InfoChanged('params')" />
                                <a-input-number v-model:value="ModelPropertyInfo.params.direct[1]" :step="0.01"
                                    :min="-1" :max="1" style="width: 57px; margin-left: 5px"
                                    @change="InfoChanged('params')" />
                                <a-input-number v-model:value="ModelPropertyInfo.params.direct[2]" :step="0.01"
                                    :min="-1" :max="1" style="width: 57px; margin-left: 5px"
                                    @change="InfoChanged('params')" />
                            </a-form-item>
                            <a-form-item label="边长" v-if="'XLen' in ModelPropertyInfo.params"
                                style="margin-left: 14px;">
                                <a-input-number v-model:value="ModelPropertyInfo.params.XLen" :step="0.01"
                                    style="width: 57px; margin-left: 5px" @change="InfoChanged('params')" />
                                <a-input-number v-model:value="ModelPropertyInfo.params.YLen" :step="0.01"
                                    style="width: 57px; margin-left: 5px" @change="InfoChanged('params')" />
                                <a-input-number v-model:value="ModelPropertyInfo.params.ZLen" :step="0.01"
                                    style="width: 57px; margin-left: 5px" @change="InfoChanged('params')" />
                            </a-form-item>
                        </a-list-item>
                    </a-list>
                </a-collapse-panel>
                <a-collapse-panel key="3" header="特征">
                </a-collapse-panel>
            </a-collapse>
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
    min-height: 100px;
    overflow: auto;
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