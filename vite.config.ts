import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { URL, fileURLToPath } from 'node:url'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '~': fileURLToPath(new URL('./', import.meta.url)),
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        host: true,
        proxy: {
            // 配置代理：将 /youdao 开头的请求转发到有道服务器
            '/youdao': {
                target: 'https://dict.youdao.com', // 目标接口域名
                changeOrigin: true, // 必须：修改请求头中的 Origin 为目标域名，解决跨域
                rewrite: (path) => path.replace(/^\/youdao/, ''), // 路径重写：去掉 /youdao 前缀
                secure: false // 如果是 https 接口，可能需要设置为 false（视情况而定）
            },
            // 配置代理：将 /ocr 开头的请求转发到OCR服务器
            '/ocr': {
                target: 'https://api.ocr.space', // 目标接口域名
                changeOrigin: true, // 必须：修改请求头中的 Origin 为目标域名，解决跨域
                rewrite: (path) => path.replace(/^\/ocr/, ''), // 路径重写：去掉 /ocr 前缀
                secure: false // 如果是 https 接口，可能需要设置为 false（视情况而定）
            },
            // 配置代理：将 /api 开头的请求转发到本地后端服务器
            '/api': {
                target: 'http://localhost:3000', // 后端API服务器地址
                changeOrigin: true, // 修改请求头中的 Origin 为目标域名，解决跨域
                rewrite: (path) => path.replace(/^\/api/, '/api'), // 保持路径不变
                secure: false // 本地开发环境设为false
            }
        }
    }
})
