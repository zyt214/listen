<template>
    <div class="exam-result">
        <div class="bg-decoration">
            <div class="bg-circle bg-circle-1"></div>
            <div class="bg-circle bg-circle-2"></div>
        </div>

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
            <h1 class="nav-title">考试详情</h1>
            <div class="nav-right"></div>
        </div>

        <div class="content">
            <!-- 考试信息 -->
            <div class="info-card">
                <h3 class="card-title">考试信息</h3>
                <div class="info-rows">
                    <div class="info-row">
                        <span class="info-label">考试时间</span>
                        <span class="info-value">{{ examInfo.date }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">考试教材</span>
                        <span class="info-value">{{ examInfo.textbookName }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">单词数量</span>
                        <span class="info-value">
                            <span class="stat-chip">{{ examInfo.wordCount }} 个</span>
                        </span>
                    </div>
                </div>
            </div>

            <!-- 单词列表 -->
            <div class="words-card">
                <h3 class="card-title">考试单词</h3>
                <div class="word-grid">
                    <div v-for="(word, index) in examInfo.words" :key="index" class="word-chip">
                        <span class="word-index">{{ index + 1 }}</span>
                        <span class="word-en">{{ word.word || word.english }}</span>
                        <span class="word-zh">{{ word.meaning || word.chinese }}</span>
                    </div>
                </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
                <a-button class="action-btn primary-btn" block @click="startExam">开始考试</a-button>
                <a-button class="action-btn export-btn" block @click="exportPDF">导出 PDF</a-button>
                <a-button class="action-btn home-btn" block @click="goHome">返回首页</a-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDictationStore } from '../stores/dictation'
import { generatePDF, ExamRecord } from '../utils/pdfExport'

interface ExamInfo {
    id: number
    name: string
    textbookName: string
    date: string
    wordCount: number
    words: { english: string; chinese: string }[]
}

const router = useRouter()
const dictationStore = useDictationStore()

const examInfo = ref<ExamInfo>({
    id: 0,
    name: '',
    textbookName: '',
    date: '',
    wordCount: 0,
    words: []
})

const goBack = () => {
    router.back()
}

const goHome = () => {
    router.push('/')
}

const startExam = () => {
    const wordList = examInfo.value.words.map((word: any) => ({
        english: word.word || word.english,
        chinese: word.meaning || word.chinese,
        phonetic: word.phonetic || '',
        audio: word.audio_en || word.audio || null,
        audio_en: word.audio_en || '',
        audio_zh: word.audio_zh || ''
    }))
    dictationStore.setWords(wordList)
    dictationStore.setTextbook({ bookName: examInfo.value.textbookName } as any)
    router.push('/dictation')
}

const loadExamInfo = () => {
    try {
        const examHistory = JSON.parse(localStorage.getItem('examHistory') || '[]')
        const urlParams = new URLSearchParams(window.location.search)
        const examId = urlParams.get('examId')

        if (examId) {
            const examRecord = examHistory.find((exam: ExamInfo) => exam.id === parseInt(examId))
            if (examRecord) {
                examInfo.value = examRecord
                return
            }
        }

        if (examHistory.length > 0) {
            const latestExam = examHistory[examHistory.length - 1]
            examInfo.value = latestExam
        } else {
            const currentWords = dictationStore.currentWords
            if (currentWords.length > 0) {
                examInfo.value = {
                    id: Date.now(),
                    name: '未命名考试',
                    textbookName: dictationStore.currentTextbook?.bookName || '未知教材',
                    date: new Date().toISOString().split('T')[0],
                    wordCount: currentWords.length,
                    words: currentWords
                }
            }
        }
    } catch (error) {
        console.error('加载考试信息失败:', error)
    }
}

const exportPDF = async () => {
    await generatePDF(examInfo.value as ExamRecord)
}

onMounted(() => {
    loadExamInfo()
})
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.exam-result {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
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
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    top: -80px;
    right: -60px;
}

.bg-circle-2 {
    width: 220px;
    height: 220px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    bottom: 20%;
    left: -70px;
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

.nav-left,
.nav-right {
    width: 60px;
    display: flex;
    align-items: center;
}

.nav-right {
    justify-content: flex-end;
}

.back-btn {
    color: #333;
    padding: 10px;
    height: auto;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(102, 126, 234, 0.2);
    transition: all 0.3s ease;
}

.back-btn:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
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

.content {
    position: relative;
    z-index: 1;
    flex: 1;
    padding: 8px 20px 40px;
    overflow-y: auto;
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* 信息卡片 */
.info-card,
.words-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(102, 126, 234, 0.15);
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
}

.card-title {
    font-size: 15px;
    font-weight: 700;
    color: #334155;
    margin: 0 0 16px;
}

.info-rows {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.info-label {
    font-size: 13px;
    color: #94a3b8;
}

.info-value {
    font-size: 13px;
    font-weight: 600;
    color: #334155;
}

.stat-chip {
    font-size: 12px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
}

/* 单词网格 */
.word-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.word-chip {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(102, 126, 234, 0.04);
    border: 1px solid rgba(102, 126, 234, 0.1);
    border-radius: 12px;
    padding: 10px 14px;
}

.word-index {
    font-size: 12px;
    color: #94a3b8;
    min-width: 24px;
    text-align: right;
}

.word-en {
    font-size: 14px;
    font-weight: 600;
    color: #334155;
    flex: 1;
}

.word-zh {
    font-size: 13px;
    color: #64748b;
}

/* 操作按钮区 */
.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 8px;
}

.action-btn {
    height: 48px;
    border-radius: 80px;
    font-size: 15px;
    font-weight: 600;
    border: none;
    transition: opacity 0.2s;
}

.primary-btn {
    background: linear-gradient(90deg, rgba(123, 104, 255, 0.85) 0%, rgba(51, 112, 255, 0.85) 100%);
    color: #fff;
}

.primary-btn:hover {
    opacity: 0.9;
    color: #fff;
}

.export-btn {
    background: rgba(13, 148, 136, 0.08);
    color: #0d9488;
    border: 1px solid rgba(13, 148, 136, 0.25);
}

.export-btn:hover {
    background: rgba(13, 148, 136, 0.14);
    color: #0d9488;
    border-color: rgba(13, 148, 136, 0.35);
}

.home-btn {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    color: #475569;
    border: 1px solid rgba(102, 126, 234, 0.2);
}

.home-btn:hover {
    background: rgba(102, 126, 234, 0.08);
    color: #667eea;
    border-color: rgba(102, 126, 234, 0.3);
}
</style>
