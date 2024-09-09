<script setup>
const props = defineProps({
    toolModules: {
        type: Array,
        default: [],
    },
    name: {
        type: String,
        default: ""
    }
})
const btnsize = ['btn_l', 'btn_m', 'btn_s']
const emits = defineEmits(["click"])
const onClick = btn => emits("click", btn)
</script>
<template>
    <div class="toolBar">
        <div class="btw" v-for="item in toolModules" :key="item.name">
            <div class="module">
                <div class="tools">
                    <template v-for="tool in item.tools" :key="tool.icon">
                        <!-- 含有sons的ToolButton -->
                        <a-dropdown v-if="'sons' in tool">
                            <button :class="tool.icon + ' btn btn-light iconfont ' + btnsize[tool.type]" type="button">
                                <p>{{ tool.title }}</p>
                            </button>
                            <template #overlay>
                                <a-menu>
                                    <a-menu-item v-for="son in tool.sons" :key="son.id"
                                        @click="onClick([item.name, tool.title, son.id])">
                                        {{ son.title }}</a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                        <!-- 通用ToolButton -->
                        <button v-else :class="tool.icon + ' btn btn-light iconfont ' + btnsize[tool.type]"
                            type="button" @click="onClick([item.name, tool.title])">
                            <p>{{ tool.title }}</p>
                        </button>
                    </template>
                </div>
                <p class="tools_name ">{{ item.name }}</p>
            </div>
        </div>
        <div class="spring"></div>
    </div>
</template>



<style scoped>
.toolBar {
    height: 100%;
    display: flex;
    flex-direction: row;
    gap: 7px;
    padding: 0 7px;
}

.spring {
    flex: 1;
}

.btw {
    resize: horizontal;
    overflow: hidden;
}

.module {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.tools {
    height: calc(100% - 27px);
    flex: 1;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
}

button {
    background-color: transparent;
    border: none;
}

.btn_l {
    height: 100%;
    font-size: 40px;
    line-height: 40px;
}

.btn_l p {
    font-size: 14px;
}

.btn_m {
    height: 50%;
    font-size: 20px;
    line-height: 30px;
}

.btn_m p {
    visibility: hidden;
    font-size: 10px;
}


.btn_s {
    height: 33.3%;
    font-size: 20px;
    line-height: 20px;
}

.btn_s p {
    display: inline;
    font-size: 10px;
}

.tools_name {
    height: 27px;
    text-align: center;
    line-height: 27px;
    color: skyblue;
}
</style>