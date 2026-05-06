<template>
    <div class="textbook-selector">
        <div class="header">
            <a-button type="text" class="back-btn" @click="goBack">
                <LeftOutlined />
            </a-button>
            <h2 class="header-title">选择教材</h2>
            <div class="header-spacer"></div>
        </div>

        <div class="content">
            <!-- 小学教材 -->
            <div class="grade-section">
                <div class="section-header" @click="toggleSection('gradeSchool')">
                    <h3 class="section-title">小学</h3>
                    <div class="section-toggle">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ rotated: expandedSections.gradeSchool }">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>
                </div>
                <div v-show="expandedSections.gradeSchool" class="textbook-list">
                    <div v-for="(textbook, index) in gradeSchoolTextbooks" :key="index" class="textbook-item" @click="selectTextbook('gradeSchool', textbook)">
                        <img class="textbook-icon" src="@/assets/img/svg/book.svg" alt="" />
                        <div class="textbook-info">
                            <h4 class="textbook-name">{{ textbook.bookName }}</h4>
                            <p class="textbook-press">{{ textbook.publisher }}</p>
                        </div>
                        <div class="arrow">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div v-if="gradeSchoolTextbooks.length === 0" class="empty-textbooks">
                        <p>暂无小学教材</p>
                    </div>
                </div>
            </div>

            <!-- 初中教材 -->
            <div class="grade-section">
                <div class="section-header" @click="toggleSection('middleSchool')">
                    <h3 class="section-title">初中</h3>
                    <div class="section-toggle">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ rotated: expandedSections.middleSchool }">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>
                </div>
                <div v-show="expandedSections.middleSchool" class="textbook-list">
                    <div v-for="(textbook, index) in middleSchoolTextbooks" :key="index" class="textbook-item" @click="selectTextbook('middleSchool', textbook)">
                        <img class="textbook-icon" src="@/assets/img/svg/book.svg" alt="" />
                        <div class="textbook-info">
                            <h4 class="textbook-name">{{ textbook.bookName }}</h4>
                            <p class="textbook-press">{{ textbook.publisher }}</p>
                        </div>
                        <div class="arrow">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div v-if="middleSchoolTextbooks.length === 0" class="empty-textbooks">
                        <p>暂无初中教材</p>
                    </div>
                </div>
            </div>

            <!-- 高中教材 -->
            <div class="grade-section" v-if="highSchoolTextbooks?.length">
                <div class="section-header" @click="toggleSection('highSchool')">
                    <h3 class="section-title">高中</h3>
                    <div class="section-toggle">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ rotated: expandedSections.highSchool }">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>
                </div>
                <div v-show="expandedSections.highSchool" class="textbook-list">
                    <div v-for="(textbook, index) in highSchoolTextbooks" :key="index" class="textbook-item" @click="selectTextbook('highSchool', textbook)">
                        <img class="textbook-icon" src="@/assets/img/svg/book.svg" alt="" />
                        <div class="textbook-info">
                            <h4 class="textbook-name">{{ textbook.bookName }}</h4>
                            <p class="textbook-press">{{ textbook.publisher }}</p>
                        </div>
                        <div class="arrow">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div v-if="highSchoolTextbooks.length === 0" class="empty-textbooks">
                        <p>暂无高中教材</p>
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

const router = useRouter()
const dictationStore = useDictationStore()

const gradeSchoolTextbooks = ref<Textbook[]>([])
const middleSchoolTextbooks = ref<Textbook[]>([])
const highSchoolTextbooks = ref<Textbook[]>([])
const expandedSections = ref({
    gradeSchool: true, // 默认展开小学
    middleSchool: false, // 默认折叠初中
    highSchool: false // 默认折叠高中
})

const goBack = () => {
    router.back()
}

const selectTextbook = (grade: string, textbook: Textbook) => {
    dictationStore.setGrade(grade)
    dictationStore.setTextbook(textbook)
    router.push('/textbook/unit')
}

const toggleSection = (section: string) => {
    expandedSections.value[section as keyof typeof expandedSections.value] = !expandedSections.value[section as keyof typeof expandedSections.value]
}

// 加载教材数据
const loadTextbooks = async () => {
    try {
        // 使用统一的API接口获取教材数据
        const response = await textbookAPI.getTextbooks()

        if (response.data.success && response.data.data) {
            const list = response.data.data.sort((a, b) => a.id - b.id)

            // 根据grade字段分类教材
            // 小学: grade 1-6 (对应1-6年级)
            gradeSchoolTextbooks.value = list.slice(0, 8)

            // 初中: grade 7-9 (对应7-9年级)
            middleSchoolTextbooks.value = list.slice(8)
        } else {
            console.error('API返回数据格式错误:', response.data)
        }
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

.textbook-selector {
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
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 1px 0 rgba(120, 140, 255, 0.1);
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

.grade-section {
    margin-bottom: 20px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.82);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 2px 12px rgba(100, 120, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.9);
    overflow: hidden;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(240, 247, 255, 0.9);
    border-bottom: 1px solid rgba(120, 140, 255, 0.08);
}

.section-header:hover {
    background: rgba(224, 236, 255, 0.95);
}

.section-title {
    font-size: 16px;
    margin: 0;
    color: #1e293b;
    font-weight: 700;
    letter-spacing: -0.3px;
}

.section-toggle {
    color: #64748b;
    transition: all 0.3s ease;
}

.section-toggle svg {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
}

.section-toggle .rotated {
    transform: rotate(90deg);
}

.empty-textbooks {
    padding: 40px 20px;
    text-align: center;
    color: #64748b;
    font-size: 14px;
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
    margin: 0 20px;
    padding: 20px 0;
    background: #ffffff;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.textbook-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.textbook-icon {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
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
