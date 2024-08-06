<script setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
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
const onClick = (btn) => {
    emits("click", btn)
}
const headers = {
    authorization: 'authorization-text',
};
const url = ""
const handleChange = info => {
    if (info.file.status !== 'uploading') {
        console.log(info.file);
    }
    if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
    }
    axios.get('/data/list')
        .then(function (response) {
            // handle success
            console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
        });
};
const customRequest = file => {

}
</script>
<template>
    <div class="toolBar">
        <div class="btw" v-for="item in toolModules" :key="item.name">
            <div class="module">
                <div class="tools">
                    <template v-for="tool in item.tools" :key="tool.icon">
                        <a-upload name="file" :action="url" :headers="headers" @change="handleChange"
                            :customRequest="customRequest" :showUploadList="false" v-if="tool.title == '打开'">
                            <button :class="tool.icon + ' btn btn-light iconfont ' + btnsize[tool.type]" type="button"
                                @click="onClick([item.name, tool.title])">
                                <p>{{ tool.title }}</p>
                            </button>
                        </a-upload>
                        <button :class="tool.icon + ' btn btn-light iconfont ' + btnsize[tool.type]" type="button"
                            @click="onClick([item.name, tool.title])" v-else>
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