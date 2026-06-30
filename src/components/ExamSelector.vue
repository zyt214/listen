<template>
    <div class="exam-selector">
        <div class="header">
            <a-button type="text" class="back-btn" @click="goBack">←</a-button>
            <h2 class="header-title">选择考试教材</h2>
            <div class="header-spacer"></div>
        </div>

        <div class="content">
            <!-- 小学教材 -->
            <div class="grade-section">
                <h3 class="section-title">小学</h3>
                <div class="textbook-list">
                    <div v-for="(textbook, index) in gradeSchoolTextbooks" :key="index" class="textbook-item" @click="selectTextbook('gradeSchool', textbook)">
                        <div class="textbook-icon">
                            <span class="icon-text">📚</span>
                        </div>
                        <div class="textbook-info">
                            <h4 class="textbook-name">{{ textbook.bookName }}</h4>
                            <p class="textbook-press">{{ textbook.press || textbook.publisher }}</p>
                        </div>
                        <div class="arrow">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 初中教材 -->
            <div class="grade-section">
                <h3 class="section-title">初中</h3>
                <div class="textbook-list">
                    <div v-for="(textbook, index) in middleSchoolTextbooks" :key="index" class="textbook-item" @click="selectTextbook('middleSchool', textbook)">
                        <div class="textbook-icon">
                            <span class="icon-text">📚</span>
                        </div>
                        <div class="textbook-info">
                            <h4 class="textbook-name">{{ textbook.bookName }}</h4>
                            <p class="textbook-press">{{ textbook.press || textbook.publisher }}</p>
                        </div>
                        <div class="arrow">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 高中教材 -->
            <div class="grade-section" v-if="highSchoolTextbooks?.length">
                <h3 class="section-title">高中</h3>
                <div class="textbook-list">
                    <div v-for="(textbook, index) in highSchoolTextbooks" :key="index" class="textbook-item" @click="selectTextbook('highSchool', textbook)">
                        <div class="textbook-icon">
                            <span class="icon-text">📚</span>
                        </div>
                        <div class="textbook-info">
                            <h4 class="textbook-name">{{ textbook.bookName }}</h4>
                            <p class="textbook-press">{{ textbook.press || textbook.publisher }}</p>
                        </div>
                        <div class="arrow">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useDictationStore } from '../stores/dictation'
import { studyAPI } from '../utils/api'

interface Textbook {
    bookName: string
    press: string
    publisher?: string
    fileName?: string
    [key: string]: any
}

const router = useRouter()
const dictationStore = useDictationStore()

const gradeSchoolTextbooks = ref<Textbook[]>([])
const middleSchoolTextbooks = ref<Textbook[]>([])
const highSchoolTextbooks = ref<Textbook[]>([])

const goBack = () => {
    router.back()
}

const selectTextbook = async (grade: string, textbook: Textbook) => {
    dictationStore.setGrade(grade)
    dictationStore.setTextbook(textbook)

    try {
        // 加载教材数据
        const module = await import(`../../textbook/${grade}/${textbook.fileName}.json`)
        const allWords = extractWords(module.default.unitVocabulary)

        // 随机抽取100个单词（如果不够则全部使用）
        const examWords = shuffleArray(allWords).slice(0, 100)

        // 保存考试单词
        dictationStore.setWords(examWords)

        // 记录考试信息
        const response = await studyAPI.createExamRecord({
            name: `${textbook.bookName}-${new Date().toISOString().slice(0, 19).replace('T', ' ')}`,
            textbookName: textbook.bookName,
            wordCount: examWords.length,
            words: examWords
        })
        const examRecord = response.data.data

        // 跳转到考试页面
        router.push({
            path: '/exam/result',
            query: { examId: String(examRecord.id) }
        })
    } catch (error) {
        console.error('加载教材数据失败:', error)
        if (!(error as any).response) {
            message.error('加载教材数据失败，请重试')
        }
    }
}

// 提取所有单词
const extractWords = (unitVocabulary: Record<string, any[]>) => {
    const words: { english: string; chinese: string }[] = []

    for (const unitName in unitVocabulary) {
        const unitWords = unitVocabulary[unitName]
        unitWords.forEach((word: any) => {
            words.push({
                english: word.word || word.english,
                chinese: word.meaning || word.chinese
            })
        })
    }

    return words
}

// 随机打乱数组
const shuffleArray = (array: any[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

// 加载教材数据
const loadTextbooks = async () => {
    try {
        // 加载小学教材
        const gradeSchoolFiles = await import.meta.glob('/textbook/gradeSchool/*.json')
        for (const path in gradeSchoolFiles) {
            const module = await gradeSchoolFiles[path]()
            const textbook = module.default.bookInfo
            const fileName = path.split('/').pop()?.replace('.json', '')
            if (fileName) {
                textbook.fileName = fileName
            }
            gradeSchoolTextbooks.value.push(textbook)
        }

        // 加载初中教材
        const middleSchoolFiles = await import.meta.glob('/textbook/middleSchool/*.json')
        for (const path in middleSchoolFiles) {
            const module = await middleSchoolFiles[path]()
            const textbook = module.default.bookInfo
            const fileName = path.split('/').pop()?.replace('.json', '')
            if (fileName) {
                textbook.fileName = fileName
            }
            middleSchoolTextbooks.value.push(textbook)
        }

        // 加载高中教材
        const highSchoolFiles = await import.meta.glob('/textbook/highSchool/*.json')
        for (const path in highSchoolFiles) {
            const module = await highSchoolFiles[path]()
            const textbook = module.default.bookInfo
            const fileName = path.split('/').pop()?.replace('.json', '')
            if (fileName) {
                textbook.fileName = fileName
            }
            highSchoolTextbooks.value.push(textbook)
        }

        // 按 order 字段排序
        gradeSchoolTextbooks.value.sort((a, b) => (a.order || 999) - (b.order || 999))
        middleSchoolTextbooks.value.sort((a, b) => (a.order || 999) - (b.order || 999))
        highSchoolTextbooks.value.sort((a, b) => (a.order || 999) - (b.order || 999))
    } catch (error) {
        console.error('加载教材失败:', error)
    }
}

onMounted(() => {
    loadTextbooks()
})
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.exam-selector {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.back-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.03);
    transition: all 0.3s ease;
    font-size: 20px;
    line-height: 1;
}

.back-btn:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
}

.header-title {
    font-size: 18px;
    margin: 0;
    color: #1e293b;
    font-weight: 700;
    letter-spacing: -0.3px;
}

.header-spacer {
    width: 40px;
}

.content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
}

.grade-section {
    margin-bottom: 32px;
}

.section-title {
    font-size: 18px;
    margin-bottom: 16px;
    color: #1e293b;
    font-weight: 700;
    letter-spacing: -0.3px;
}

.textbook-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.textbook-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(0, 0, 0, 0.03);
}

.textbook-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.textbook-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    flex-shrink: 0;
}

.icon-text {
    font-size: 28px;
    line-height: 1;
}

.textbook-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    margin-left: 16px;
}

.textbook-name {
    font-size: 16px;
    margin: 0;
    color: #1e293b;
    font-weight: 600;
    letter-spacing: -0.2px;
}

.textbook-press {
    font-size: 13px;
    margin: 0;
    color: #64748b;
    line-height: 1.4;
}

.arrow {
    color: #94a3b8;
    transition: all 0.3s ease;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.textbook-item:hover .arrow {
    color: #667eea;
    transform: translateX(2px);
}
</style>
