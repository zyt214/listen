<template>
    <div class="textbook-unit-selector">
        <div class="header">
            <a-button type="text" class="back-btn" @click="goBack">
                <LeftOutlined />
            </a-button>
            <h2 class="header-title">{{ textbookName }}</h2>
            <div class="header-spacer"></div>
        </div>

        <div class="content">
            <!-- <div class="book-info">
                <div class="book-info-left">
                    <div class="book-icon">
                        <span class="icon-text">📚</span>
                    </div>
                    <div class="book-info-text">
                        <p class="book-press">{{ textbookPress }}</p>
                        <p class="book-description">{{ textbookDescription }}</p>
                    </div>
                </div>
            </div> -->

            <div class="unit-section">
                <!-- <div class="section-header">
                    <h3 class="section-title">选择单元</h3>
                    <div class="section-stats">
                        <span class="stat-item">{{ totalUnits }} 个单元</span>
                        <span class="stat-item">{{ totalWords }} 个单词</span>
                    </div>
                </div> -->
                <div class="unit-list">
                    <div v-for="(unit, index) in units" :key="index" class="unit-item" @click="selectUnit(unit)">
                        <img class="unit-icon" src="@/assets/img/svg/word.svg" alt="" />
                        <div class="unit-info">
                            <h4 class="unit-name">{{ unit.unitName }}</h4>
                            <p class="unit-count">{{ unit.wordCount }} 个单词</p>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDictationStore } from '../stores/dictation'
import { LeftOutlined } from '@ant-design/icons-vue'
import { textbookAPI } from '../utils/api'
import { a } from 'vue-router/dist/index-BzEKChPW.js'

interface Unit {
    unitName: string
    wordCount: number
}

interface Word {
    word: string
    phonetic: string
    meaning: string
    isStandard: boolean
    page: number
}

const router = useRouter()
const dictationStore = useDictationStore()

const units = ref<Unit[]>([])

const textbookName = computed(() => dictationStore.currentTextbook?.bookName || '')
const textbookPress = computed(() => dictationStore.currentTextbook?.press || dictationStore.currentTextbook?.publisher || '')
const textbookDescription = computed(() => dictationStore.currentTextbook?.description || '')

// 计算总单元数和总单词数
const totalUnits = computed(() => units.value.length)
const totalWords = computed(() => units.value.reduce((sum, unit) => sum + unit.wordCount, 0))

const goBack = () => {
    router.back()
}

const selectUnit = async (unit: Unit) => {
    try {
        const textbook = dictationStore.currentTextbook

        if (!textbook || !textbook.id) {
            console.error('缺少教材信息')
            return
        }

        // 显示加载状态
        const loading = ref(true)

        // 通过getUnitWords方法获取单元详细单词列表
        const response = await textbookAPI.getUnitWords(textbook.id, unit.unitName)

        let wordList = []
        if (response.data.success && response.data.data) {
            // 转换API返回的单词数据格式
            wordList = response.data.data
                ?.sort((a, b) => a.id - b.id)
                .map((word: any) => ({
                    id: word.id || 0,
                    english: word.word || word.english,
                    chinese: word.meaning || word.chinese,
                    audio_en: word.audio_en || null,
                    audio_zh: word.audio_zh || null,
                    phonetic: word.phonetic || '',
                    audio: null,
                    isStandard: word.isStandard || true,
                    page: word.page || 0
                }))

            console.log(`获取到单元"${unit.unitName}"的单词列表:`, wordList)
        } else {
            console.warn(`单元"${unit.unitName}"暂无单词数据，使用空列表`)
        }

        // 存储数据并跳转
        dictationStore.setUnit(unit.unitName)
        dictationStore.setWords(wordList)
        dictationStore.setUnits(units.value)

        // 跳转到听写页面
        router.push('/dictation')
    } catch (error) {
        console.error('选择单元失败:', error)

        // 如果获取单词失败，使用空列表继续
        const wordList = []
        dictationStore.setUnit(unit.unitName)
        dictationStore.setWords(wordList)
        dictationStore.setUnits(units.value)
        router.push('/dictation')
    }
}

// 加载教材单元数据
const loadUnitData = async () => {
    try {
        const textbook = dictationStore.currentTextbook

        if (!textbook || !textbook.id) {
            console.error('缺少教材信息或教材ID')
            return
        }

        // 使用API接口获取教材单元信息
        const response = await textbookAPI.getTextbookUnits(textbook.id)

        if (response.data.success && response.data.data) {
            // 假设API返回的数据包含units字段
            // 如果API返回的是单元列表，直接赋值
            units.value = response?.data?.data || []
            console.log('单元数据:', units.value)
        } else {
            console.error('API返回数据格式错误:', response.data)
        }
    } catch (error) {
        console.error('加载教材单元数据失败:', error)
    }
}

onMounted(() => {
    loadUnitData()
})
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.textbook-unit-selector {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #f0f7ff 0%, #e8e8ff 100%);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    /* background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 1px 0 rgba(120, 140, 255, 0.1);
    position: sticky; */
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
    color: #475569;
}

.back-btn:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
}

.back-btn svg {
    width: 20px;
    height: 20px;
    stroke: currentColor;
}

.content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
}

.book-info {
    background: rgba(255, 255, 255, 0.82);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 32px;
    box-shadow: 0 2px 12px rgba(100, 120, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.9);
}

.book-info-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.book-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #4f9cf9 0%, #7c6ff7 100%);
    flex-shrink: 0;
}

.icon-text {
    font-size: 28px;
    line-height: 1;
}

.book-info-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
}

.book-press {
    margin: 0;
    font-size: 16px;
    color: #1e293b;
    font-weight: 600;
    letter-spacing: -0.2px;
}

.book-description {
    font-size: 13px;
    line-height: 1.4;
    margin: 0;
    color: #64748b;
}

.unit-section {
    margin-bottom: 24px;
}

.section-title {
    font-size: 18px;
    margin-bottom: 16px;
    color: #1e293b;
    font-weight: 700;
    letter-spacing: -0.3px;
}

.unit-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.unit-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: rgba(255, 255, 255, 0.82);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(100, 120, 255, 0.08);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(255, 255, 255, 0.9);
}

.unit-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.unit-icon {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.unit-icon-text {
    font-size: 24px;
    line-height: 1;
}

.unit-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    margin-left: 16px;
}

.unit-name {
    font-size: 16px;
    margin: 0;
    color: #1e293b;
    font-weight: 600;
    letter-spacing: -0.2px;
}

.unit-count {
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

.unit-item:hover .arrow {
    color: #667eea;
    transform: translateX(2px);
}
</style>
