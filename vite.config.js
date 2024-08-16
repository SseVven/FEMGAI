import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],


  // //-----------------------Axios跨域请求-----------------------------------------
  // devServer: {
  //   port: 5173,//vue网页访问的端口
  //   host: "127.0.0.1",//vue网页访问的地址
  //   https: false,
  //   open: false,
  //   proxy: {
  //     '/api': {  //为用于替换的的标识字符串
  //       target: 'http://localhost:8080/',//Axios跨域请求的IP
  //       changeOrigin: true,
  //       ws: true,
  //       pathRewrite: {
  //         '^/api': '' //不改变
  //       }
  //     },
  //     /* 可以同步配置多个转发目标
  //     '/phpUrl': {  //为用于替换的的标识字符串
  //       target: 'http://192.168.1.8:8080/VueApi',//Axios跨域请求的IP
  //       changeOrigin: true, 
  //       ws: true,
  //       pathRewrite: {
  //           '^/phpUrl': '' //不用改
  //       }
  //    }  */

  //   }
  // },
  // //----------------------------------------------------------------------------

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
