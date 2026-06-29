import axios from 'axios'
import { useAuthStore } from '../stores/auth'

let refreshPromise: Promise<string | null> | null = null

// 创建axios实例
const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
api.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么
        console.log(`发送请求: ${config.method?.toUpperCase()} ${config.url}`)

        // 添加认证 token（如果有的话）
        const authStore = useAuthStore()
        const token = authStore.getToken
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        // 对请求错误做些什么
        console.error('请求错误:', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
api.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        console.log(`响应成功: ${response.status} ${response.config.url}`)
        return response
    },
    async (error) => {
        // 对响应错误做点什么
        console.error('响应错误:', error)

        if (error.response) {
            // 服务器返回了错误状态码
            switch (error.response.status) {
                case 401:
                    console.error('未授权，请重新登录')
                    if (!error.config?._retry && !String(error.config?.url || '').startsWith('/auth/')) {
                        error.config._retry = true
                        const authStore = useAuthStore()

                        refreshPromise =
                            refreshPromise ||
                            api
                                .post('/auth/refresh')
                                .then((response) => {
                                    authStore.setSession(response.data.data)
                                    return response.data.data.accessToken
                                })
                                .catch(() => {
                                    authStore.clearSession()
                                    return null
                                })
                                .finally(() => {
                                    refreshPromise = null
                                })

                        const token = await refreshPromise
                        if (token) {
                            error.config.headers.Authorization = `Bearer ${token}`
                            return api(error.config)
                        }
                    }
                    break
                case 403:
                    console.error('禁止访问')
                    break
                case 404:
                    console.error('请求的资源不存在')
                    break
                case 500:
                    console.error('服务器内部错误')
                    break
                default:
                    console.error('请求失败:', error.response.status)
            }
        } else if (error.request) {
            // 请求发送了但没有收到响应
            console.error('网络错误，请检查网络连接')
        } else {
            // 其他错误
            console.error('请求配置错误:', error.message)
        }

        return Promise.reject(error)
    }
)

// API 接口函数
export const textbookAPI = {
    // 获取教材列表
    getTextbooks: () => api.get('/textbooks'),

    // 根据ID获取教材详情
    getTextbookById: (id: number) => api.get(`/textbooks/${id}`),

    // 获取教材单元列表
    getTextbookUnits: (id: number) => api.get(`/textbooks/${id}/units`),

    // 获取单元单词列表
    getUnitWords: (textbookId: number, unitName?: string) =>
        api.get(`/textbooks/${textbookId}/words`, {
            params: {
                unit_name: unitName
            }
        }),

    // 批量更新单词音频
    batchUpdateWordAudio: (data: {
        words: Array<{
            id: number
            word: string
            audio_zh: string
            audio_en: string
        }>
    }) => api.put('/textbooks/words/audio/batch', data),

    // 创建教材
    createTextbook: (data: any) => api.post('/textbooks', data),

    // 更新教材
    updateTextbook: (id: number, data: any) => api.put(`/textbooks/${id}`, data),

    // 删除教材
    deleteTextbook: (id: number) => api.delete(`/textbooks/${id}`)
}

// OCR相关API接口
export const ocrAPI = {
    // 创建OCR任务
    createOCRTask: (data: { name: string }) => api.post('/ocr', data),

    // 删除OCR任务
    deleteOCRTask: (id: number) => api.delete(`/ocr/${id}`),

    // 获取OCR任务列表
    getOCRTasks: () => api.get('/ocr'),

    // 批量添加单词到OCR任务
    batchAddWords: (
        ocrId: number,
        data: {
            words: Array<{
                word: string
                phonetic: string
                meaning: string
                audio_zh: string
                audio_en: string
            }>
        }
    ) => api.post(`/ocr/${ocrId}/words/batch`, data),

    // 获取OCR任务的单词列表
    getOCRTaskWords: (ocrId: number) => api.get(`/ocr/${ocrId}/words`)
}

// 导出默认实例
export default api
