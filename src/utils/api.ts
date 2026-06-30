import axios from 'axios'
import { message } from 'ant-design-vue'
import { useAuthStore } from '../stores/auth'

let refreshPromise: Promise<string | null> | null = null
let lastErrorMessage = ''
let lastErrorTime = 0

const ERROR_MESSAGE_DEDUP_MS = 1500

const shouldSkipErrorMessage = (error: any) => {
    return Boolean(error.config?.skipErrorMessage)
}

const showErrorMessage = (content: string) => {
    const now = Date.now()
    if (content === lastErrorMessage && now - lastErrorTime < ERROR_MESSAGE_DEDUP_MS) {
        return
    }

    lastErrorMessage = content
    lastErrorTime = now
    message.error(content)
}

const getResponseErrorMessage = (error: any) => {
    if (error.response) {
        const serverMessage = error.response.data?.message || error.response.data?.error
        if (serverMessage) {
            return serverMessage
        }

        switch (error.response.status) {
            case 400:
                return '请求参数错误'
            case 401:
                return '登录状态已失效，请重新登录'
            case 403:
                return '没有权限执行该操作'
            case 404:
                return '请求的资源不存在'
            case 409:
                return '数据已存在或发生冲突'
            case 500:
                return '服务器内部错误，请稍后重试'
            default:
                return `请求失败：${error.response.status}`
        }
    }

    if (error.code === 'ECONNABORTED') {
        return '请求超时，请稍后重试'
    }

    if (error.request) {
        return '网络异常，请检查网络连接'
    }

    return error.message || '请求失败，请稍后重试'
}

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
        if (!shouldSkipErrorMessage(error)) {
            showErrorMessage(getResponseErrorMessage(error))
        }
        return Promise.reject(error)
    }
)

// 响应拦截器
api.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        console.log(`响应成功: ${response.status} ${response.config.url}`)
        if (response.data?.meta) {
            response.data.pagination = response.data.meta.pagination ?? response.data.pagination
            response.data.count = response.data.meta.count ?? response.data.count
            response.data.filter = response.data.meta.filter ?? response.data.filter
            response.data.totalUnits = response.data.meta.totalUnits ?? response.data.totalUnits
            response.data.totalWords = response.data.meta.totalWords ?? response.data.totalWords
        }
        return response
    },
    async (error) => {
        // 对响应错误做点什么
        console.error('响应错误:', error)
        const requestUrl = String(error.config?.url || '')

        if (error.response) {
            // 服务器返回了错误状态码
            switch (error.response.status) {
                case 401:
                    console.error('未授权，请重新登录')
                    if (!error.config?._retry && !requestUrl.startsWith('/auth/')) {
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

        if (!shouldSkipErrorMessage(error)) {
            const isSilentAuthRefresh = requestUrl === '/auth/refresh'
            if (!isSilentAuthRefresh) {
                showErrorMessage(getResponseErrorMessage(error))
            }
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

// 第三方能力代理 API。密钥由后端环境变量管理，前端不直接暴露。
export const integrationAPI = {
    recognizeImage: (data: { base64Image: string; language?: string }) => api.post('/integrations/ocr', data),
    synthesizeSpeech: (data: { text: string; lang?: string; voiceId?: string; model?: string }) =>
        api.post('/integrations/tts', data)
}

// 学习记录相关 API
export const studyAPI = {
    createDictationRecord: (data: any) => api.post('/study/dictation-records', data),
    getDictationRecords: (params?: { page?: number; pageSize?: number }) => api.get('/study/dictation-records', { params }),
    getDictationRecord: (id: number | string) => api.get(`/study/dictation-records/${id}`),
    deleteDictationRecord: (id: number | string) => api.delete(`/study/dictation-records/${id}`),
    clearDictationRecords: () => api.delete('/study/dictation-records'),

    upsertVocabularySource: (data: any) => api.post('/study/vocabulary/sources', data),
    getVocabularyProgress: (params: { sourceType: string; sourceId: string }) => api.get('/study/vocabulary/progress', { params }),
    updateVocabularyProgress: (data: any) => api.post('/study/vocabulary/words/progress', data),

    createErrorBookRecord: (data: any) => api.post('/study/error-book-records', data),
    getErrorBookRecords: () => api.get('/study/error-book-records'),
    deleteErrorBookRecord: (id: number | string) => api.delete(`/study/error-book-records/${id}`),
    clearErrorBookRecords: () => api.delete('/study/error-book-records'),

    createExamRecord: (data: any) => api.post('/study/exam-records', data),
    getExamRecords: (params?: { page?: number; pageSize?: number }) => api.get('/study/exam-records', { params }),
    getExamRecord: (id: number | string) => api.get(`/study/exam-records/${id}`),
    deleteExamRecord: (id: number | string) => api.delete(`/study/exam-records/${id}`),
    checkExamName: (name: string) => api.get('/study/exam-records/check-name', { params: { name } })
}

// 导出默认实例
export default api
