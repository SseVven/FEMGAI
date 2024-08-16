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

const beforeCreate = () => {
    // 读取文件
    FileReader.prototype.reading = function ({ encode } = pms) {
        let bytes = new Uint8Array(this.result);    //无符号整型数组
        let text = new TextDecoder(encode || 'UTF-8').decode(bytes);
        return text;
    };
    /* 重写readAsBinaryString函数 */
    FileReader.prototype.readAsBinaryString = function (f) {
        if (!this.onload)       //如果this未重写onload函数，则创建一个公共处理方式
            this.onload = e => {  //在this.onload函数中，完成公共处理
                let rs = this.reading();
                console.log(rs);
            };
        this.readAsArrayBuffer(f);  //内部会回调this.onload方法
    };
};
beforeCreate();
const read = (f) => {
    let rd = new FileReader();
    rd.onload = e => {
        //this.readAsArrayBuffer函数内，会回调this.onload函数。在这里处理结果
        let cont = rd.reading({ encode: 'utf-8' })
        console.log('数据', cont)
        // 这个是我前端页面填充读取的wsdl数据的
        // this.form.setFieldsValue({ serviceWsdl: cont })
        // let formerData = this.textData
        // this.textData = formerData + "\n" + cont
    }
    rd.readAsBinaryString(f)
}

const beforeUpload = (file) => {
    console.log('打开前校验--文件类型', file);
    console.log('打开前校验--文件类型', file.lastModifiedDate);
    // 读取数据
    read(file);
    return false
    // axios.get('/data/list')
    //     .then(function (response) {
    //         // handle success
    //         console.log(response);
    //     })
    //     .catch(function (error) {
    //         // handle error
    //         console.log(error);
    //     })
    //     .finally(function () {
    //         // always executed
    //     });
};
</script>
<template>
    <div class="toolBar">
        <div class="btw" v-for="item in toolModules" :key="item.name">
            <div class="module">
                <div class="tools">
                    <template v-for="tool in item.tools" :key="tool.icon">
                        <a-upload accept=".mmf" :beforeUpload="beforeUpload" :showUploadList="false"
                            v-if="tool.title == '打开'">
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