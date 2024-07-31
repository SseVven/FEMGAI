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
        console.log(ModelPropertyInfo.value.key, val);
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
    console.log("component-node-queryRes", val);
    ModelPropertyInfo.value = val;
    // ModelPropertyInfo.value.name = "2131"
})
const ExpandKey = ref([]);
// 接收信息 对组件控制器的修改信息
EventBus.on('dataStructChange', (val) => {
    console.log("dataStructChange:", val);
    switch (val[0]) {
        // 初始化
        case 0:
            treeData.value = val[1];
            break;
        // 新增
        case 1:
            let node = treeData.value;
            let eky;
            for (let i = 0; i < val[1].length; i++) {
                eky = node[val[1][i]].key;
                node = node[val[1][i]].children;
            }
            node.push({
                title: val[3],
                key: val[2],
                type: val[4]
            })
            ExpandKey.value.push(eky)
            break;
        default:
            break;
    }
})

const activeKey = ref([]);
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
                    <!-- <template #icon><carry-out-outlined /></template> -->
                    <template #title="{ dataRef }">
                        <!-- <template v-if="dataRef.key === '0-0-0-1'">
                            <div>multiple line title</div>
                            <div>multiple line title</div>
                        </template> -->
                        {{ dataRef.title }}
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
                <span style="line-height: 32px;">{{ ModelPropertyInfo.model_type }}</span>
            </div>
            <a-collapse v-model:activeKey="activeKey" accordion>
                <a-collapse-panel key="1" header="属性" v-if="'property' in ModelPropertyInfo">




                    <a-list size="small">
                        <a-list-item>颜色：
                            <a-row>
                                <a-col :span="7">
                                    <a-input-number v-model:value="ModelPropertyInfo.property.color[0]"
                                        style="margin-left: 16px;width: 70px;" :min="0" :max="1" :step="0.001"
                                        @change="InfoChanged('color')" />
                                </a-col>
                                <a-col :span="7">
                                    <a-input-number v-model:value="ModelPropertyInfo.property.color[1]"
                                        style="margin-left: 16px;width: 70px;" :min="0" :max="1" :step="0.001"
                                        @change="InfoChanged('color')" />
                                </a-col>
                                <a-col :span="7">
                                    <a-input-number v-model:value="ModelPropertyInfo.property.color[2]"
                                        style="margin-left: 16px;width: 70px;" :min="0" :max="1" :step="0.001"
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
                <a-collapse-panel key="2" header="参数">
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