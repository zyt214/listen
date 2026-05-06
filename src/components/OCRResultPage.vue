<template>
    <div class="ocr-result-page">
        <!-- 背景装饰 -->
        <div class="bg-decoration">
            <div class="bg-circle bg-circle-1"></div>
            <div class="bg-circle bg-circle-2"></div>
            <div class="bg-circle bg-circle-3"></div>
        </div>

        <!-- 顶部导航 -->
        <div class="nav-header">
            <div class="nav-left">
                <a-button type="text" class="back-btn" @click="goBack">
                    <span class="back-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </span>
                </a-button>
            </div>
            <h1 class="nav-title">识别中</h1>
            <div class="nav-right"></div>
        </div>

        <div class="page-content">
            <!-- 识别中状态 -->
            <div v-if="isRecognizing" class="recognizing-section">
                <div class="glass-card recognizing-card">
                    <!-- 图片预览 -->
                    <div class="image-preview-wrapper">
                        <img v-if="currentImage" :src="currentImage" alt="识别图片" class="preview-image" />
                    </div>

                    <!-- 动画图标 -->
                    <div class="animation-wrapper">
                        <div class="scanning-line"></div>
                    </div>

                    <!-- 进度信息 -->
                    <div class="progress-info">
                        <div class="progress-text">{{ progressText }}</div>
                        <div class="progress-percent">{{ recognitionProgress }}%</div>
                    </div>

                    <!-- 进度条 -->
                    <div class="progress-bar-wrapper">
                        <div class="progress-bar" :style="{ width: recognitionProgress + '%' }"></div>
                    </div>

                    <!-- 状态说明 -->
                    <div class="status-description">
                        <div v-if="recognitionProgress < 30" class="status-item">
                            <LoadingOutlined class="status-icon" />
                            <span>正在上传图片...</span>
                        </div>
                        <div v-else-if="recognitionProgress < 60" class="status-item">
                            <LoadingOutlined class="status-icon" />
                            <span>正在识别文字...</span>
                        </div>
                        <div v-else-if="recognitionProgress < 80" class="status-item">
                            <LoadingOutlined class="status-icon" />
                            <span>正在翻译单词...</span>
                        </div>
                        <div v-else class="status-item">
                            <CheckCircleOutlined class="status-icon success" />
                            <span>即将完成...</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 识别完成状态 -->
            <div v-else-if="isCompleted" class="result-section">
                <div class="glass-card result-card">
                    <!-- 成功图标 -->
                    <div class="success-icon">
                        <CheckCircleOutlined />
                    </div>

                    <!-- 结果摘要 -->
                    <h2 class="result-title">识别完成！</h2>
                    <p class="result-desc">共识别到 {{ recognizedWords.length }} 个单词</p>

                    <!-- 统计信息 -->
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-value">{{ recognizedWords.length }}</div>
                            <div class="stat-label">单词总数</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">{{ uploadedImagesCount }}</div>
                            <div class="stat-label">图片数量</div>
                        </div>
                    </div>
                </div>

                <!-- 识别结果列表 -->
                <div class="glass-card words-card">
                    <div class="card-header">
                        <span class="card-title">识别结果</span>
                        <span class="card-badge">{{ recognizedWords.length }} 个单词</span>
                    </div>
                    <div class="words-list">
                        <div v-for="(word, index) in recognizedWords" :key="index" class="word-item">
                            <div class="word-index">{{ index + 1 }}</div>
                            <div class="word-info">
                                <div v-if="!word.isEditing" class="word-content">
                                    <div class="word-english">{{ word.english }}</div>
                                    <div class="word-chinese">{{ word.chinese }}</div>
                                </div>
                                <div v-else class="word-edit">
                                    <input type="text" v-model="word.english" class="word-input english" placeholder="英文单词" />
                                    <input type="text" v-model="word.chinese" class="word-input chinese" placeholder="中文释义" />
                                </div>
                            </div>
                            <div class="word-actions">
                                <a-button type="text" size="small" @click="editWord(index)">
                                    <EditOutlined />
                                </a-button>
                                <a-button type="text" size="small" danger @click="deleteWord(index)">
                                    <DeleteOutlined />
                                </a-button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 操作按钮 -->
                <div class="action-buttons">
                    <a-button type="primary" size="large" block class="action-btn" @click="saveToLibrary" :loading="isSaving">
                        {{ isSaving ? '保存中...' : '保存到听写库' }}
                    </a-button>
                </div>
            </div>

            <!-- 识别失败状态 -->
            <div v-else-if="hasError" class="error-section">
                <div class="glass-card error-card">
                    <div class="error-icon">
                        <CloseCircleOutlined />
                    </div>
                    <h2 class="error-title">识别失败</h2>
                    <p class="error-desc">{{ errorMessage }}</p>
                    <a-button type="primary" size="large" @click="retryRecognition"> 重新识别 </a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined, ScanOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CameraOutlined, HomeOutlined } from '@ant-design/icons-vue'
import { useDictationStore } from '../stores/dictation'
import { ocrAPI } from '../utils/api'

interface Word {
    english: string
    chinese: string
    isEditing?: boolean
}

const router = useRouter()
const dictationStore = useDictationStore()

const uploadedImages = ref<string[]>([])
const currentImage = ref('')
const isRecognizing = ref(true)
const isCompleted = ref(false)
const hasError = ref(false)
const isSaving = ref(false)
const recognitionProgress = ref(0)
const progressText = ref('准备中...')
const errorMessage = ref('')
const recognizedWords = ref<Word[]>([])
const uploadedImagesCount = ref(0)

const goBack = () => {
    router.push('/')
}

const goHome = () => {
    router.push('/')
}

const editWord = (index: number) => {
    const word = recognizedWords.value[index]
    const currentEditing = word.isEditing

    // 先将所有单词的编辑状态设置为 false
    recognizedWords.value.forEach((w) => {
        w.isEditing = false
    })

    // 切换当前单词的编辑状态
    word.isEditing = !currentEditing
}

const deleteWord = (index: number) => {
    recognizedWords.value.splice(index, 1)
}

const translateWords = async (words: string[]): Promise<Word[]> => {
    const translationPromises = words.map(async (word): Promise<Word> => {
        try {
            const response = await fetch(`/youdao/jsonapi?q=${encodeURIComponent(word)}`)
            const data = await response.json()

            let chinese = '未知'
            if (data?.individual?.trs?.length) {
                chinese = data.individual.trs.map((t: any) => t.tran).join('; ')
            }
            chinese = chinese.split('；').slice(0, 1).join('；')

            return { english: word, chinese }
        } catch (error) {
            return { english: word, chinese: '翻译失败' }
        }
    })
    return Promise.all(translationPromises)
}

const ocrSpaceApi = async (base64Image: string, language = 'eng') => {
    const API_KEY = 'K86075366888957'
    const base64Data = base64Image.replace(/^data:image\/[^;]+;base64,/, '')

    const formData = new FormData()
    formData.append('apikey', API_KEY)
    formData.append('language', language)
    formData.append('base64Image', `data:image/png;base64,${base64Data}`)
    formData.append('isOverlayRequired', 'false')
    formData.append('scale', 'true')
    formData.append('OCREngine', '2')

    try {
        const response = await fetch('/ocr/parse/image', { method: 'POST', body: formData })
        const result = await response.json()

        if (result.OCRExitCode !== 1) {
            throw result.ErrorMessage || '识别失败'
        }

        return result.ParsedResults[0]?.TextOverlay?.Lines?.map((item: any) => item.LineText) || []
    } catch (error) {
        throw error || '识别失败'
    }
}

const parseWordListText = (rawText: string[]) => {
    if (!rawText) return []
    const lines = rawText
        .map((line) =>
            line
                .trim()
                .replace(/[-•.*_]+/g, '')
                .replace(/\s+/g, ' ')
        )
        .filter((line) => {
            if (/^[A-Za-z]$/.test(line)) return false
            if (/^\d+$/.test(line)) return false
            if (/[\u4e00-\u9fa5]/.test(line)) return false
            return true
        })
    return lines.filter((item, index, self) => index === self.findIndex((i) => i === item))
}

const startRecognition = async () => {
    if (uploadedImages.value.length === 0) {
        router.back()
        return
    }

    isRecognizing.value = true
    isCompleted.value = false
    hasError.value = false
    recognitionProgress.value = 0
    recognizedWords.value = []

    try {
        const allWords: string[] = []
        const totalImages = uploadedImages.value.length
        uploadedImagesCount.value = totalImages

        for (let i = 0; i < totalImages; i++) {
            currentImage.value = uploadedImages.value[i]
            progressText.value = `正在处理第 ${i + 1} 张图片...`
            recognitionProgress.value = Math.round((i / totalImages) * 30)

            const words = await ocrSpaceApi(uploadedImages.value[i], 'eng')
            const parsedWords = parseWordListText(words)
            allWords.push(...parsedWords)

            recognitionProgress.value = Math.round(((i + 1) / totalImages) * 60)
        }

        progressText.value = '正在翻译单词...'
        recognitionProgress.value = 70

        const translatedWords = await translateWords(allWords)
        recognizedWords.value = translatedWords

        recognitionProgress.value = 100
        progressText.value = '识别完成！'

        isRecognizing.value = false
        isCompleted.value = true

        message.success(`识别完成，共提取到 ${translatedWords.length} 个单词`)
    } catch (error: any) {
        console.error('识别失败:', error)
        isRecognizing.value = false
        hasError.value = true
        errorMessage.value = error?.message || '请重试'
    }
}

const retryRecognition = () => {
    hasError.value = false
    startRecognition()
}

const startNewRecognition = () => {
    router.push('/upload')
}

const saveToLibrary = async () => {
    if (recognizedWords.value.length === 0) return

    isSaving.value = true

    try {
        // 创建OCR任务
        const timestamp = new Date().getTime()
        const recordName = `素材_${timestamp}`

        const createResponse = await ocrAPI.createOCRTask({ name: recordName })

        if (!createResponse.data.success) {
            throw new Error(createResponse.data.message || '创建OCR任务失败')
        }

        const ocrId = createResponse.data.data.id
        console.log('OCR任务创建成功，ID:', ocrId)
        const wordsToAdd = recognizedWords.value.map((w) => ({
            word: w.english,
            phonetic: '', // 可以留空或从其他地方获取
            meaning: w.chinese,
            audio_zh: '',
            audio_en: ''
        }))

        // 批量合成音频并添加到OCR任务
        // const wordsToAdd = []
        // let synthesizedCount = 0

        // for (let i = 0; i < recognizedWords.value.length; i++) {
        //     const word = recognizedWords.value[i]

        //     // 更新进度
        //     const progress = Math.round((i / recognizedWords.value.length) * 100)
        //     console.log(`合成进度: ${progress}% - 处理单词: ${word.english}`)

        //     // 合成英文音频
        //     const audio_en = await synthesizeSpeech(word.english, 'en-US')

        //     // 合成中文音频
        //     const audio_zh = await synthesizeSpeech(word.chinese, 'zh-CN')

        //     if (audio_en || audio_zh) {
        //         synthesizedCount++
        //     }

        //     wordsToAdd.push({
        //         word: word.english,
        //         phonetic: '', // 可以留空或从其他地方获取
        //         meaning: word.chinese,
        //         audio_zh: audio_zh || '',
        //         audio_en: audio_en || ''
        //     })

        //     // 添加限流延迟，避免API请求过于频繁
        //     await new Promise((resolve) => setTimeout(resolve, 200))
        // }

        const batchResponse = await ocrAPI.batchAddWords(ocrId, { words: wordsToAdd })

        if (!batchResponse.data.success) {
            throw new Error(batchResponse.data.message || '批量添加单词失败')
        }

        // 设置当前单词列表到 dictationStore
        dictationStore.setWords(recognizedWords.value)

        // 设置教材信息（模拟一个教材对象）
        dictationStore.setTextbook({
            bookName: '听写库',
            press: '未知出版社',
            standard: '未知标准',
            description: '未知描述'
        })

        // 设置单元信息
        dictationStore.setUnit(recordName)

        message.success(`成功保存 ${recognizedWords.value.length} 个单词到听写库!`)

        // 跳转到听写练习页面
        router.push('/material')
    } catch (error) {
        console.error('保存失败:', error)
        message.error(`保存失败: ${error.message || '请重试'}`)
    } finally {
        isSaving.value = false
    }
}

// const saveToLibrary = async () => {
//     if (recognizedWords.value.length === 0) return

//     isSaving.value = true

//     try {
//         const timestamp = new Date().getTime()
//         const recordName = `素材_${timestamp}`

//         dictationStore.setWords(recognizedWords.value)
//         dictationStore.setTextbook({
//             bookName: '听写库',
//             press: '未知出版社',
//             standard: '未知标准',
//             description: '未知描述'
//         })
//         dictationStore.setUnit(recordName)

//         message.success(`已保存 ${recognizedWords.value.length} 个单词！`)
//         router.push('/material')
//         return
//         router.push('/dictation')
//     } catch (error: any) {
//         message.error(`保存失败: ${error.message || '请重试'}`)
//     } finally {
//         isSaving.value = false
//     }
// }

onMounted(() => {
    const images = sessionStorage.getItem('ocr_images')
    if (images) {
        try {
            uploadedImages.value = JSON.parse(images)
            sessionStorage.removeItem('ocr_images')
            startRecognition()
        } catch {
            hasError.value = true
            errorMessage.value = '图片加载失败'
        }
    } else {
        hasError.value = true
        errorMessage.value = '没有找到上传的图片'
    }
})
</script>

<style scoped>
.ocr-result-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f0f7ff 0%, #e8e8ff 100%);
    position: relative;
    overflow-x: hidden;
}

.bg-decoration {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 0;
}

.bg-circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.2;
}

.bg-circle-1 {
    width: 280px;
    height: 280px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    top: -80px;
    right: -60px;
    animation: float 8s ease-in-out infinite;
}

.bg-circle-2 {
    width: 220px;
    height: 220px;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    bottom: 30%;
    left: -70px;
    animation: float 10s ease-in-out infinite reverse;
}

.bg-circle-3 {
    width: 180px;
    height: 180px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    bottom: -40px;
    right: 15%;
    animation: float 12s ease-in-out infinite;
}

@keyframes float {
    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }
    50% {
        transform: translateY(-20px) rotate(5deg);
    }
}

.nav-header {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    padding-top: calc(16px + env(safe-area-inset-top));
}

.back-btn {
    color: #333;
    padding: 10px;
    height: auto;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(102, 126, 234, 0.2);
}

.back-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-title {
    color: #333;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
}

.nav-left,
.nav-right {
    width: 50px;
}

.page-content {
    position: relative;
    z-index: 1;
    padding: 20px;
    padding-bottom: calc(20px + env(safe-area-inset-bottom));
}

.glass-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(102, 126, 234, 0.15);
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
}

/* 识别中状态 */
.recognizing-section {
    padding-top: 40px;
}

.recognizing-card {
    padding: 32px 24px;
    text-align: center;
}

.image-preview-wrapper {
    width: 180px;
    height: 180px;
    margin: 0 auto 24px;
    border-radius: 16px;
    overflow: hidden;
    background: rgba(102, 126, 234, 0.1);
    border: 1px solid rgba(102, 126, 234, 0.2);
}

.preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.animation-wrapper {
    position: absolute;
    top: 32px;
    left: 50%;
    transform: translateX(-50%);
    width: 180px;
    height: 180px;
    margin: 0 auto 24px;
}

.scanning-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, transparent, #667eea, transparent);
    animation: scan 2s ease-in-out infinite;
}

@keyframes scan {
    0%,
    100% {
        top: 0;
    }
    50% {
        top: calc(100% - 4px);
    }
}

.progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.progress-text {
    color: rgba(0, 0, 0, 0.7);
    font-size: 14px;
}

.progress-percent {
    color: #667eea;
    font-size: 18px;
    font-weight: 700;
}

.progress-bar-wrapper {
    width: 100%;
    height: 8px;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 24px;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 4px;
    transition: width 0.3s ease;
}

.status-description {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.status-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
}

.status-icon {
    color: #667eea;
    font-size: 16px;
}

.status-icon.success {
    color: #52c41a;
}

/* 识别完成状态 */
.result-section {
    animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.result-card {
    padding: 32px 24px;
    text-align: center;
    margin-bottom: 20px;
}

.success-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    color: #fff;
    animation: bounceIn 0.6s ease;
}

@keyframes bounceIn {
    0% {
        transform: scale(0);
    }
    50% {
        transform: scale(1.2);
    }
    70% {
        transform: scale(0.9);
    }
    100% {
        transform: scale(1);
    }
}

.result-title {
    color: #333;
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 8px;
}

.result-desc {
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
    margin: 0 0 24px;
}

.stats-grid {
    display: flex;
    justify-content: center;
    gap: 48px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item .stat-value {
    font-size: 32px;
    font-weight: 700;
    color: #667eea;
}

.stat-item .stat-label {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.5);
    margin-top: 4px;
}

.words-card {
    padding: 20px;
    margin-bottom: 24px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-title {
    color: #333;
    font-size: 16px;
    font-weight: 600;
    margin: 0;
}

.card-badge {
    background: rgba(102, 126, 234, 0.2);
    color: #667eea;
    font-size: 12px;
    padding: 4px 12px;
    border-radius: 20px;
}

.words-list {
    max-height: 300px;
    overflow-y: auto;
}

.word-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(102, 126, 234, 0.05);
    border-radius: 12px;
    margin-bottom: 8px;
    border: 1px solid rgba(102, 126, 234, 0.1);
}

.word-index {
    width: 28px;
    height: 28px;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #667eea;
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
}

.word-info {
    flex: 1;
    min-width: 0;
}

.word-english {
    color: #333;
    font-size: 15px;
    font-weight: 600;
}

.word-chinese {
    color: rgba(0, 0, 0, 0.6);
    font-size: 13px;
    margin-top: 2px;
}

.word-edit {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.word-input {
    padding: 6px 10px;
    border: 1px solid rgba(102, 126, 234, 0.3);
    border-radius: 6px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.3s ease;
}

.word-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.word-input.english {
    font-weight: 600;
}

.word-input.chinese {
    font-size: 13px;
    color: #666;
}

.word-actions {
    display: flex;
    gap: 4px;
}

/* 操作按钮 */
.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.action-btn {
    height: 56px;
    border-radius: 80px;
    background: linear-gradient(90deg, #7b68ff 0%, #3370ff 100%);
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.action-btn.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

.action-btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
    color: #fff;
}

.action-btn.secondary {
    background: rgba(255, 255, 255, 0.8);
    color: #333;
    border: 1px solid rgba(102, 126, 234, 0.3);
}

.action-btn.secondary:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #333;
}

/* 错误状态 */
.error-section {
    padding-top: 60px;
}

.error-card {
    padding: 48px 24px;
    text-align: center;
}

.error-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    color: #fff;
}

.error-title {
    color: #333;
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 8px;
}

.error-desc {
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
    margin: 0 0 24px;
}
</style>
