<template>
    <div class="exam-config">
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
            <h1 class="nav-title">创建考试</h1>
            <div class="nav-right"></div>
        </div>

        <div class="content">
            <div class="form-card">
                <a-form layout="vertical">
                    <a-form-item label="考试名称" :validate-status="nameError ? 'error' : ''" :help="nameError">
                        <a-input v-model:value="examName" placeholder="请输入考试名称" @blur="checkExamName" :status="nameError ? 'error' : ''" />
                    </a-form-item>

                    <a-form-item label="选择教材">
                        <a-select v-model:value="selectedTextbook" placeholder="请选择教材" @change="onTextbookChange" style="width: 100%">
                            <a-select-opt-group label="小学" v-if="gradeSchoolTextbooks?.length">
                                <a-select-option v-for="textbook in gradeSchoolTextbooks" :key="textbook.id" :value="JSON.stringify({ textbook: textbook })">
                                    {{ textbook.bookName }}
                                </a-select-option>
                            </a-select-opt-group>
                            <a-select-opt-group label="初中" v-if="middleSchoolTextbooks.length">
                                <a-select-option v-for="textbook in middleSchoolTextbooks" :key="textbook.id" :value="JSON.stringify({ textbook: textbook })">
                                    {{ textbook.bookName }}
                                </a-select-option>
                            </a-select-opt-group>
                        </a-select>
                    </a-form-item>

                    <a-form-item label="单词数量">
                        <div class="word-count-row">
                            <button class="count-btn" @click="decreaseWordCount" :disabled="wordCount <= 20">−</button>
                            <a-input-number v-model:value="wordCount" :min="20" :max="100" @change="validateWordCount" />
                            <button class="count-btn" @click="increaseWordCount" :disabled="wordCount >= 100">+</button>
                        </div>
                        <div class="count-info">20 - 100 个单词</div>
                    </a-form-item>

                    <div v-if="selectedTextbookInfo" class="textbook-info">
                        <div class="info-row">
                            <span class="info-label">教材名称</span>
                            <span class="info-value">{{ selectedTextbookInfo.textbook.bookName }}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">出版社</span>
                            <span class="info-value">{{ selectedTextbookInfo.textbook.publisher }}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">可用单词</span>
                            <span class="info-value stat-chip">{{ totalWords }} 个</span>
                        </div>
                    </div>
                </a-form>

                <a-button class="create-btn" :disabled="!canCreate" :loading="isCreating" @click="createExam" block>
                    {{ isCreating ? '创建中...' : '创建考试' }}
                </a-button>
            </div>

            <div class="records-section">
                <div class="section-header">
                    <h3 class="section-title">试卷记录</h3>
                    <a-button type="link" class="toggle-btn" @click="showAllRecords = !showAllRecords" v-if="examRecords.length > 3">
                        {{ showAllRecords ? '收起' : '查看全部' }}
                    </a-button>
                </div>

                <div v-if="examRecords.length === 0" class="empty-state">
                    <div class="empty-icon">📋</div>
                    <p class="empty-title">暂无试卷记录</p>
                    <p class="empty-desc">创建考试后，记录将显示在这里</p>
                </div>

                <div v-else class="record-list">
                    <div v-for="record in displayRecords" :key="record.id" class="record-card">
                        <div class="record-header">
                            <div class="record-meta">
                                <span class="record-date">{{ record.date }}</span>
                                <span class="record-source">{{ record.name }}</span>
                            </div>
                            <a-button type="text" class="delete-btn" @click="deleteExamRecord(record.id)">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </a-button>
                        </div>
                        <div class="record-stats">
                            <div class="stat-chip">共 {{ record.wordCount }} 词</div>
                            <div class="stat-chip book">{{ record.textbookName }}</div>
                        </div>
                        <a-button class="redo-btn" block @click="viewExamDetails(record)">查看详情</a-button>
                    </div>

                    <div v-if="examRecords.length > 3 && !showAllRecords" class="records-hint">
                        <a-button type="link" class="toggle-btn" @click="showAllRecords = true">查看全部 {{ examRecords.length }} 条记录</a-button>
                    </div>
                </div>
            </div>
        </div>
        <BottomNav />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDictationStore } from '../stores/dictation'
import { message } from 'ant-design-vue'
import { textbookAPI } from '../utils/api'
import { showConfirm } from '../utils/confirm'
import BottomNav from './BottomNav.vue'

interface Textbook {
    id: number
    bookName: string
    approvalInfo: string
    award: string
    publisher: string
    grade: number
    compilationUnit: string
    author: string
    firstEdition: string
    coreUnitCount: number
    fullModuleList: string
    createdAt: string
    updatedAt: string
    [key: string]: any
}

interface TextbookSelection {
    grade: string
    textbook: Textbook
}

interface ExamRecord {
    id: number
    name: string
    textbookName: string
    wordCount: number
    date: string
    words: { english: string; chinese: string }[]
}

const router = useRouter()
const dictationStore = useDictationStore()

const examName = ref('')
const selectedTextbook = ref(null)
const wordCount = ref(50)
const isCreating = ref(false)
const nameError = ref('')
const totalWords = ref(0)
const allWords = ref<any[]>([])
const examRecords = ref<ExamRecord[]>([])
const showAllRecords = ref(false)

const gradeSchoolTextbooks = ref<Textbook[]>([])
const middleSchoolTextbooks = ref<Textbook[]>([])
const highSchoolTextbooks = ref<Textbook[]>([])

const selectedTextbookInfo = computed(() => {
    if (!selectedTextbook.value) return null
    try {
        return JSON.parse(selectedTextbook.value) as TextbookSelection
    } catch {
        return null
    }
})

const canCreate = computed(() => {
    return examName.value.trim() && selectedTextbook.value && !nameError.value && wordCount.value >= 20 && wordCount.value <= 100
})

const displayRecords = computed(() => {
    if (showAllRecords.value) {
        return examRecords.value
    } else {
        return examRecords.value.slice(0, 3)
    }
})

const goBack = () => {
    router.back()
}

const checkExamName = () => {
    const name = examName.value.trim()
    if (!name) {
        nameError.value = '考试名称不能为空'
        return
    }
    const examHistory = JSON.parse(localStorage.getItem('examHistory') || '[]')
    const isDuplicate = examHistory.some((exam: any) => exam.name === name)
    if (isDuplicate) {
        nameError.value = '考试名称已存在，请使用其他名称'
    } else {
        nameError.value = ''
    }
}

const decreaseWordCount = () => {
    if (wordCount.value > 20) {
        wordCount.value--
    }
}

const increaseWordCount = () => {
    if (wordCount.value < 100) {
        wordCount.value++
    }
}

const validateWordCount = () => {
    if (wordCount.value < 20) {
        wordCount.value = 20
    } else if (wordCount.value > 100) {
        wordCount.value = 100
    }
}

const onTextbookChange = async () => {
    if (selectedTextbookInfo.value) {
        await loadTextbookWords()
    } else {
        totalWords.value = 0
        allWords.value = []
    }
}

const loadTextbookWords = async () => {
    if (!selectedTextbookInfo.value) return
    try {
        const { textbook } = selectedTextbookInfo.value
        const response = await textbookAPI.getUnitWords(textbook.id)
        if (response.data.success && response.data.data) {
            allWords.value = response.data.data || []
            totalWords.value = allWords.value.length
        } else {
            totalWords.value = 0
            allWords.value = []
        }
    } catch (error) {
        console.error('加载教材单词失败:', error)
        totalWords.value = 0
        allWords.value = []
    }
}

const shuffleArray = (array: any[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

const createExam = async () => {
    if (!canCreate.value) return
    isCreating.value = true
    try {
        const textbookInfo = selectedTextbookInfo.value
        if (!textbookInfo) {
            message.error('教材信息解析失败，请重新选择教材')
            isCreating.value = false
            return
        }
        if (allWords.value.length === 0) {
            message.error('该教材暂无单词数据')
            isCreating.value = false
            return
        }
        const examWords = shuffleArray(allWords.value).slice(0, wordCount.value)
        dictationStore.setTextbook(textbookInfo.textbook)
        dictationStore.setWords(examWords)
        const examRecord = {
            id: Date.now(),
            name: examName.value.trim(),
            textbookName: textbookInfo.textbook.bookName,
            wordCount: examWords.length,
            date: new Date().toISOString().split('T')[0],
            words: examWords
        }
        const examHistory = JSON.parse(localStorage.getItem('examHistory') || '[]')
        examHistory.push(examRecord)
        localStorage.setItem('examHistory', JSON.stringify(examHistory))
        loadExamRecords()
        router.push({
            path: '/exam/result',
            query: { examId: examRecord.id.toString() }
        })
    } catch (error) {
        console.error('创建考试失败:', error)
        message.error('创建考试失败，请重试')
    } finally {
        isCreating.value = false
    }
}

const loadExamRecords = () => {
    try {
        const examHistory = JSON.parse(localStorage.getItem('examHistory') || '[]')
        examRecords.value = examHistory
    } catch (error) {
        console.error('加载考试记录失败:', error)
        examRecords.value = []
    }
}

const viewExamDetails = (record: ExamRecord) => {
    router.push({
        path: '/exam/result',
        query: { examId: record.id.toString() }
    })
}

const deleteExamRecord = (id: number) => {
    showConfirm({
        title: '确认删除',
        content: '确定要删除这条试卷记录吗？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
            try {
                const examHistory = JSON.parse(localStorage.getItem('examHistory') || '[]')
                const updatedHistory = examHistory.filter((record: any) => record.id !== id)
                localStorage.setItem('examHistory', JSON.stringify(updatedHistory))
                loadExamRecords()
                message.success('删除成功')
            } catch (error) {
                console.error('删除考试记录失败:', error)
                message.error('删除失败，请重试')
            }
        }
    })
}

const loadTextbooks = async () => {
    try {
        gradeSchoolTextbooks.value = []
        middleSchoolTextbooks.value = []
        highSchoolTextbooks.value = []
        const response = await textbookAPI.getTextbooks()
        if (response.data.success && response.data.data) {
            const list = response.data.data.sort((a, b) => a.id - b.id)
            gradeSchoolTextbooks.value = list.slice(0, 8)
            middleSchoolTextbooks.value = list.slice(8)
        } else {
            console.error('API返回数据格式错误:', response.data)
        }
    } catch (error) {
        console.error('加载教材失败:', error)
    }
}

onMounted(async () => {
    await loadTextbooks()
    loadExamRecords()
})
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.exam-config {
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
}

/* 表单卡片 */
.form-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(102, 126, 234, 0.15);
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
    margin-bottom: 24px;
}

/* 单词数量行 */
.word-count-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.count-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid rgba(102, 126, 234, 0.3);
    background: rgba(102, 126, 234, 0.06);
    color: #667eea;
    font-size: 20px;
    font-weight: 400;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
}

.count-btn:hover:not(:disabled) {
    background: rgba(102, 126, 234, 0.15);
    border-color: #667eea;
}

.count-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.count-info {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 6px;
    text-align: center;
}

/* 教材信息块 */
.textbook-info {
    background: rgba(102, 126, 234, 0.05);
    border: 1px solid rgba(102, 126, 234, 0.15);
    border-radius: 14px;
    padding: 16px;
    margin-top: 4px;
    display: flex;
    flex-direction: column;
    gap: 10px;
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

/* 创建按钮 */
.create-btn {
    margin-top: 24px;
    height: 48px;
    border-radius: 80px;
    background: linear-gradient(90deg, rgba(123, 104, 255, 0.85) 0%, rgba(51, 112, 255, 0.85) 100%);
    border: none;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    transition: opacity 0.2s;
}

.create-btn:hover:not(:disabled) {
    opacity: 0.9;
    color: #fff;
}

.create-btn:disabled {
    opacity: 0.45;
    color: #fff;
}

/* 记录区域 */
.records-section {
    margin-top: 8px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
}

.section-title {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
    color: #334155;
}

.toggle-btn {
    color: #667eea;
    font-size: 13px;
    padding: 0;
    height: auto;
}

/* 空状态 */
.empty-state {
    text-align: center;
    padding: 48px 20px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 20px;
    border: 1px solid rgba(102, 126, 234, 0.1);
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
}

.empty-title {
    font-size: 15px;
    font-weight: 600;
    color: #334155;
    margin: 0 0 6px;
}

.empty-desc {
    font-size: 13px;
    color: #94a3b8;
    margin: 0;
}

/* 记录列表 */
.record-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.record-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(102, 126, 234, 0.15);
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
}

.record-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 12px;
}

.record-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.record-date {
    font-size: 12px;
    color: #94a3b8;
}

.record-source {
    font-size: 14px;
    font-weight: 600;
    color: #334155;
}

.delete-btn {
    color: #cbd5e1;
    padding: 4px;
    height: auto;
    transition: color 0.2s;
}

.delete-btn:hover {
    color: #ff4d4f;
}

.record-stats {
    display: flex;
    gap: 8px;
    margin-bottom: 14px;
    flex-wrap: wrap;
}

.stat-chip {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px;
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
}

.stat-chip.book {
    background: rgba(102, 126, 234, 0.06);
    color: #7b93c9;
    border: 1px solid rgba(102, 126, 234, 0.12);
}

.redo-btn {
    height: 40px;
    border-radius: 80px;
    background: linear-gradient(90deg, rgba(123, 104, 255, 0.8) 0%, rgba(51, 112, 255, 0.8) 100%);
    border: none;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s;
}

.redo-btn:hover {
    opacity: 0.9;
    color: #fff;
}

.records-hint {
    text-align: center;
    padding-top: 8px;
}

/* Ant Design 覆盖 */
:deep(.ant-input) {
    border-radius: 12px;
    height: 44px;
    font-size: 14px;
    background: rgba(255, 255, 255, 0.7);
}

:deep(.ant-select-selector) {
    border-radius: 12px !important;
    height: 44px !important;
    display: flex !important;
    align-items: center !important;
    background: rgba(255, 255, 255, 0.7) !important;
}

:deep(.ant-select-selection-placeholder) {
    display: flex !important;
    align-items: center !important;
    height: 100% !important;
}

:deep(.ant-select-selection-item) {
    line-height: 44px !important;
}

:deep(.ant-select-selection-search-input) {
    height: 42px !important;
    line-height: 42px !important;
}

:deep(.ant-input-number) {
    border-radius: 12px;
    flex: 1;
    height: 44px;
    background: rgba(255, 255, 255, 0.7);
}

:deep(.ant-input-number-input) {
    height: 42px;
    border-radius: 12px;
}

:deep(.ant-form-item-label > label) {
    color: #475569;
    font-weight: 600;
    font-size: 13px;
}
</style>
