import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import './assets/main.css'

import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import App from './App.vue';
import 'ant-design-vue/dist/reset.css';
import "@/mockjs/index";
import axios, {isCancel, AxiosError} from 'axios';

const app = createApp(App);
app.use(Antd).mount('#app');
// createApp(App).mount('#app')
