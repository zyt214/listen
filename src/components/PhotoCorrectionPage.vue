<template>
    <div class="photo-correction-page">
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
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </span>
                </a-button>
            </div>
            <h1 class="nav-title">拍照批改</h1>
            <div class="nav-right"></div>
        </div>

        <div class="page-content">
            <!-- 拍照界面 -->
            <div v-if="!isPhotoTaken" class="photo-section">
                <!-- 说明卡片 -->
                <div class="glass-card instruction-card">
                    <!-- <div class="card-icon-wrapper">
                        <img class="card-icon" src="@/assets/img/svg/practice.svg" alt="camera.svg" />
                    </div> -->
                    <h3 class="card-title">如何进行拍照批改</h3>
                    <p class="card-desc">拍摄您听写完成的单词列表，系统将自动识别并批改</p>
                    <div class="instruction-steps">
                        <div class="step-item">
                            <div class="step-number">1</div>
                            <div class="step-text">点击下方拍照按钮</div>
                        </div>
                        <div class="step-item">
                            <div class="step-number">2</div>
                            <div class="step-text">拍摄或选择单词图片</div>
                        </div>
                        <div class="step-item">
                            <div class="step-number">3</div>
                            <div class="step-text">查看批改结果</div>
                        </div>
                    </div>
                </div>

                <!-- 拍照按钮区域 -->
                <div class="capture-area">
                    <div class="capture-circle" @click="triggerFileInput">
                        <div class="capture-inner">
                            <img class="capture-icon" src="@/assets/img/svg/camera-check.svg" alt="camera.svg" />
                        </div>
                        <div class="capture-ring"></div>
                    </div>
                    <p class="capture-hint">点击拍照或选择图片</p>
                    <input ref="fileInput" type="file" accept="image/*" capture="camera" style="display: none" @change="handleFileSelect" />
                </div>

                <!-- 提示信息 -->
                <div class="tips-card">
                    <div class="tips-icon">💡</div>
                    <div class="tips-content">
                        <div class="tips-title">拍摄建议</div>
                        <ul class="tips-list">
                            <li>确保光线充足且均匀</li>
                            <li>单词清晰可见，无反光</li>
                            <li>尽量保持纸张水平放置</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- OCR识别和批改结果 -->
            <div v-else class="correction-section">
                <!-- 图片预览 -->
                <div class="photo-preview-card">
                    <div class="preview-header">
                        <span class="preview-label">已拍摄图片</span>
                        <a-button type="link" size="small" @click="retakePhoto" class="retake-link"> 重新拍摄 </a-button>
                    </div>
                    <div class="image-container">
                        <img :src="capturedPhoto" alt="拍摄的照片" class="captured-image" />
                    </div>
                </div>

                <!-- 识别中状态 -->
                <div v-if="!ocrCompleted" class="loading-card">
                    <div class="loading-animation">
                        <div class="loading-spinner"></div>
                    </div>
                    <p class="loading-text">正在识别图片中的单词...</p>
                    <p class="loading-subtext">请稍候</p>
                </div>

                <!-- 批改结果 -->
                <div v-else class="result-section">
                    <!-- 结果摘要 -->
                    <div class="result-summary">
                        <div class="summary-card">
                            <div class="summary-text">
                                <div class="summary-title">批改完成</div>
                                <div class="summary-desc">
                                    正确 <span class="highlight correct">{{ correctCount }}</span> / 错误 <span class="highlight error">{{ errorCount }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 正确率进度条 -->
                    <div class="progress-card">
                        <div class="progress-header">
                            <span>正确率</span>
                            <span class="progress-percent">{{ Math.round((correctCount / wordComparisons.length) * 100) }}%</span>
                        </div>
                        <div class="progress-track">
                            <div class="progress-fill" :style="{ width: `${(correctCount / wordComparisons.length) * 100}%` }"></div>
                        </div>
                    </div>

                    <!-- 单词对比列表 -->
                    <div class="comparison-card">
                        <div class="card-header">
                            <span class="card-title">单词对比</span>
                            <span class="card-badge">{{ wordComparisons.length }} 个单词</span>
                        </div>
                        <div class="word-list">
                            <div v-for="(item, index) in wordComparisons" :key="index" class="word-item" :class="{ 'is-correct': item.isCorrect, 'is-error': !item.isCorrect }">
                                <div class="word-index">{{ index + 1 }}</div>
                                <div class="word-info">
                                    <div class="word-row">
                                        <span class="word-label">听写</span>
                                        <span class="word-value">{{ item.dictationWord }}</span>
                                    </div>
                                    <div class="word-row">
                                        <span class="word-label">识别</span>
                                        <span class="word-value" :class="{ 'recognition-error': !item.isCorrect }">
                                            {{ item.recognizedWord || '未识别' }}
                                        </span>
                                    </div>
                                </div>
                                <div class="word-status">
                                    <span v-if="item.isCorrect" class="status-icon correct">✓</span>
                                    <span v-else class="status-icon error">✗</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 操作按钮 -->
                    <div class="action-buttons">
                        <a-button v-if="errorCount > 0" type="primary" size="large" block class="action-btn error-book-btn" :loading="addingToErrorBook" @click="addToErrorBook">
                            <template #icon><span class="btn-emoji">📝</span></template>
                            一键加入错题本（{{ errorCount }} 个错题）
                        </a-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDictationStore } from '../stores/dictation'
import { useErrorBookStore } from '../stores/errorBook'
import { message } from 'ant-design-vue'
import { CameraOutlined } from '@ant-design/icons-vue'
import { integrationAPI } from '../utils/api'

const router = useRouter()
const dictationStore = useDictationStore()
const errorBookStore = useErrorBookStore()
const addingToErrorBook = ref(false)

// 拍照批改相关状态
const isPhotoTaken = ref(false)
const capturedPhoto = ref('')
const ocrCompleted = ref(false)
const recognizedWords = ref<string[]>([])
const wordComparisons = ref<Array<{ dictationWord: string; recognizedWord: string; isCorrect: boolean }>>([])
const correctCount = ref(0)
const errorCount = ref(0)

const goBack = () => {
    router.push('/')
}

// 触发文件选择
const triggerFileInput = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
        fileInput.click()
    }
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        const file = target.files[0]
        processImageFile(file)
    }
}

// 处理图片文件
const processImageFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
        if (e.target && e.target.result) {
            capturedPhoto.value = e.target.result as string
            isPhotoTaken.value = true
            // 开始OCR识别
            performOCR()
        }
    }
    reader.onerror = (error) => {
        console.error('读取文件失败:', error)
        message.error('读取图片失败，请重试')
    }
    reader.readAsDataURL(file)
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
            // 严格过滤无效行
            if (/^[A-Za-z]$/.test(line)) return false
            // 2. 过滤纯数字行 (整行只有数字)
            if (/^\d+$/.test(line)) return false
            // 3. 过滤包含中文的行
            if (/[\u4e00-\u9fa5]/.test(line)) return false
            return true
        })

    // 简单去重
    return lines.filter((item, index, self) => index === self.findIndex((i) => i === item))
}

const performOCR = async () => {
    try {
        const response = await integrationAPI.recognizeImage({
            base64Image: capturedPhoto.value,
            language: 'eng'
        })
        const parsedText = response.data.data.lines || []
        recognizedWords.value = parseWordListText(parsedText)

        // 比较听写内容和识别结果
        compareWords()
        ocrCompleted.value = true
    } catch (error) {
        console.error('OCR识别失败:', error)
        message.error('识别失败，请重试')
        retakePhoto()
    }
}

const compareWords = () => {
    const dictationWords = dictationStore.currentWords.map((word) => word.english.toLowerCase())

    wordComparisons.value = dictationWords.map((dictationWord, index) => {
        const recognizedWord = recognizedWords.value[index] || ''
        const isCorrect = recognizedWord === dictationWord

        return {
            dictationWord: dictationStore.currentWords[index].english,
            recognizedWord: recognizedWord || '未识别',
            isCorrect
        }
    })

    correctCount.value = wordComparisons.value.filter((comp) => comp.isCorrect).length
    errorCount.value = wordComparisons.value.filter((comp) => !comp.isCorrect).length
}

// 加入错题本
type WordComparison = { dictationWord: string; recognizedWord: string; isCorrect: boolean }
const addToErrorBook = async () => {
    if (addingToErrorBook.value) return
    addingToErrorBook.value = true
    try {
        const wrongWords = (wordComparisons.value as WordComparison[])
            .filter((comp: WordComparison) => !comp.isCorrect)
            .map((comp: WordComparison) => {
                const storeWord = dictationStore.currentWords.find((w: { english: string; chinese: string }) => w.english === comp.dictationWord)
                return {
                    english: comp.dictationWord,
                    chinese: storeWord?.chinese || '',
                    dictationWord: comp.dictationWord,
                    recognizedWord: comp.recognizedWord,
                    audio_en: storeWord?.audio_en || '',
                    audio_zh: storeWord?.audio_zh || ''
                }
            })
        await errorBookStore.addRecord({
            textbook: dictationStore.currentTextbook?.bookName || '未知教材',
            unit: dictationStore.currentUnit || '未知单元',
            totalWords: wordComparisons.value.length,
            correctCount: correctCount.value,
            errorCount: errorCount.value,
            wrongWords
        })
        message.success(`已添加 ${wrongWords.length} 个错题到错题本`)
        router.push('/errorBook')
    } catch (error) {
        console.error('添加错题本失败:', error)
    } finally {
        addingToErrorBook.value = false
    }
}

// 重新拍照
const retakePhoto = () => {
    isPhotoTaken.value = false
    capturedPhoto.value = ''
    ocrCompleted.value = false
    recognizedWords.value = []
    wordComparisons.value = []

    // 重置文件输入
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
        fileInput.value = ''
    }
}

onMounted(() => {
    // 检查是否有听写数据
    if (!dictationStore.currentWords || dictationStore.currentWords.length === 0) {
        message.warning('没有听写数据，请先完成听写练习')
        router.back()
    }
})
</script>

<style scoped>
.photo-correction-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f0f7ff 0%, #e8e8ff 100%);
    position: relative;
    overflow-x: hidden;
}

/* 背景装饰 */
.bg-decoration {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
}

.bg-circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.3;
}

.bg-circle-1 {
    width: 300px;
    height: 300px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    top: -100px;
    right: -50px;
    animation: float 8s ease-in-out infinite;
    opacity: 0.2;
}

.bg-circle-2 {
    width: 250px;
    height: 250px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    bottom: 20%;
    left: -80px;
    animation: float 10s ease-in-out infinite reverse;
    opacity: 0.15;
}

.bg-circle-3 {
    width: 200px;
    height: 200px;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    bottom: -50px;
    right: 20%;
    animation: float 12s ease-in-out infinite;
    opacity: 0.15;
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

/* 顶部导航 */
.nav-header {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    padding-top: calc(16px + env(safe-area-inset-top));
}

.nav-left,
.nav-right {
    width: 60px;
}

.back-btn {
    color: #333;
    padding: 8px;
    height: auto;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(102, 126, 234, 0.2);
    transition: all 0.3s ease;
}

.back-btn:hover {
    background: rgba(102, 126, 234, 0.1);
    transform: scale(1.05);
}

.back-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-title {
    color: #333;
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 页面内容 */
.page-content {
    position: relative;
    z-index: 1;
    padding: 0 20px;
    padding-bottom: calc(20px + env(safe-area-inset-bottom));
}

/* 玻璃卡片 */
.glass-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(102, 126, 234, 0.15);
    border-radius: 24px;
    padding: 48px 24px 28px;
    margin-bottom: 24px;
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
}

.card-icon-wrapper {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
}

.card-icon {
    font-size: 32px;
}

.card-title {
    color: #333;
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 12px;
    text-align: center;
}

.card-desc {
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
    margin: 0 0 24px;
    text-align: center;
    line-height: 1.5;
}

/* 步骤说明 */
.instruction-steps {
    display: flex;
    justify-content: space-between;
    gap: 12px;
}

.step-item {
    flex: 1;
    text-align: center;
}

.step-number {
    width: 32px;
    height: 32px;
    /* background: linear-gradient(90deg, #3370ff 0%, #667eea 100%); */
    background: #667eea;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    margin: 0 auto 10px;
}

.step-text {
    color: rgba(0, 0, 0, 0.7);
    font-size: 12px;
    line-height: 1.4;
}

/* 拍照区域 */
.capture-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0;
}

.capture-circle {
    width: 120px;
    height: 120px;
    position: relative;
    cursor: pointer;
    margin-bottom: 16px;
}

.capture-inner {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
    transition: all 0.3s ease;
}

.capture-circle:hover .capture-inner {
    transform: scale(1.08);
    box-shadow: 0 15px 50px rgba(102, 126, 234, 0.5);
}

.capture-circle:active .capture-inner {
    transform: scale(0.95);
}

.capture-icon {
    width: 48px;
}

.capture-ring {
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%,
    100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.1);
        opacity: 0.5;
    }
}

.capture-hint {
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
    margin: 0;
}

/* 提示卡片 */
.tips-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(102, 126, 234, 0.1);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    gap: 16px;
    align-items: flex-start;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.1);
}

.tips-icon {
    font-size: 24px;
    flex-shrink: 0;
}

.tips-content {
    flex: 1;
}

.tips-title {
    color: #333;
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 10px;
}

.tips-list {
    margin: 0;
    padding-left: 16px;
    color: rgba(0, 0, 0, 0.6);
    font-size: 13px;
    line-height: 1.8;
}

.tips-list li {
    margin: 0;
}

/* 批改结果区域 */
.correction-section {
    animation: fadeIn 0.4s ease;
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

/* 图片预览卡片 */
.photo-preview-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(102, 126, 234, 0.15);
    border-radius: 20px;
    padding: 16px;
    margin-bottom: 20px;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.1);
}

.preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.preview-label {
    color: rgba(0, 0, 0, 0.7);
    font-size: 14px;
    font-weight: 500;
}

.retake-link {
    color: #667eea;
    padding: 0;
    height: auto;
    font-size: 13px;
}

.image-container {
    border-radius: 12px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.3);
}

.captured-image {
    width: 100%;
    height: auto;
    max-height: 250px;
    object-fit: contain;
    display: block;
}

/* 加载状态 */
.loading-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(102, 126, 234, 0.15);
    border-radius: 20px;
    padding: 60px 40px;
    text-align: center;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.1);
}

.loading-animation {
    margin-bottom: 24px;
}

.loading-spinner {
    width: 60px;
    height: 60px;
    margin: 0 auto;
    border: 4px solid rgba(102, 126, 234, 0.1);
    border-top-color: #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.loading-text {
    color: #333;
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 8px;
}

.loading-subtext {
    color: rgba(0, 0, 0, 0.5);
    font-size: 13px;
    margin: 0;
}

/* 结果摘要 */
.result-summary {
    margin-bottom: 20px;
}

.summary-card {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(102, 126, 234, 0.15);
    border-radius: 20px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.1);
}

.summary-icon .emoji {
    font-size: 48px;
    display: block;
    /* animation: bounce 1s ease infinite; */
}

@keyframes bounce {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.summary-text {
    flex: 1;
}

.summary-title {
    color: #333;
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 8px;
}

.summary-desc {
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
    margin: 0;
}

.highlight {
    font-weight: 600;
    padding: 0 4px;
}

.highlight.correct {
    color: #52c41a;
}

.highlight.error {
    color: #ff4d4f;
}

/* 进度条 */
.progress-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(102, 126, 234, 0.15);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.1);
}

.progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.7);
    font-size: 14px;
}

.progress-percent {
    color: #667eea;
    font-size: 18px;
    font-weight: 600;
}

.progress-track {
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 4px;
    transition: width 0.5s ease;
}

/* 单词对比卡片 */
.comparison-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(102, 126, 234, 0.15);
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.1);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(102, 126, 234, 0.1);
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

.word-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 300px;
    overflow-y: auto;
}

.word-item {
    background: rgba(102, 126, 234, 0.05);
    border-radius: 12px;
    padding: 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.3s ease;
    border: 1px solid rgba(102, 126, 234, 0.1);
}

.word-item.is-correct {
    /* border-left: 3px solid #52c41a; */
    background: rgba(82, 196, 26, 0.1);
}

.word-item.is-error {
    /* border-left: 3px solid #ff4d4f; */
    background: rgba(255, 77, 79, 0.1);
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

.word-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
}

.word-row:last-child {
    margin-bottom: 0;
}

.word-label {
    color: rgba(0, 0, 0, 0.5);
    font-size: 11px;
    min-width: 32px;
}

.word-value {
    color: #333;
    font-size: 14px;
    font-weight: 500;
}

.word-value.recognition-error {
    color: #ff4d4f;
}

.word-status {
    flex-shrink: 0;
}

.status-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
}

.status-icon.correct {
    background: #52c41a;
    color: #fff;
}

.status-icon.error {
    background: #ff4d4f;
    color: #fff;
}

/* 操作按钮 */
.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.action-btn {
    height: 52px;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.action-btn.secondary {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(102, 126, 234, 0.3);
    color: #333;
}

.action-btn.error-book-btn {
    background: linear-gradient(90deg, #7b68ff 0%, #3370ff 100%);
    border: none;
    margin-bottom: 0;
    color: #fff;
    border-radius: 80px;
}

.action-btn.error-book-btn:hover {
    opacity: 0.9;
}

.btn-emoji {
    font-size: 16px;
    margin-right: 6px;
}

.action-btn.secondary:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #333;
}
</style>
