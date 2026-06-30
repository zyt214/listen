<template>
    <div class="material-library-page">
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
            <h1 class="nav-title">听写库</h1>
            <div class="nav-right"></div>
        </div>

        <div class="content">
            <div v-if="materialRecords.length === 0" class="empty-state">
                <img src="@/assets/img/svg/empty.svg" alt="" />
                <h3 class="empty-title">暂无素材记录</h3>
                <p class="empty-desc">使用拍照听写功能后，识别的单词会自动保存到这里</p>
                <a-button class="goto-btn" @click="goToUpload">去拍照</a-button>
            </div>

            <div v-else class="record-list">
                <div v-for="record in materialRecords" :key="record.id" class="record-card">
                    <div class="record-header">
                        <div class="record-meta">
                            <span class="record-date">{{ record.date || '未知日期' }}</span>
                            <span class="record-source">{{ record.name }}</span>
                        </div>
                        <a-button type="text" class="delete-btn" @click="deleteMaterialRecord(record.id)">
                            <svg data-v-258ce1e8="" data-v-d4875792="" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path data-v-258ce1e8="" data-v-d4875792="" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </a-button>
                    </div>

                    <div class="record-stats">
                        <div class="stat-chip total">共 {{ record.words.length }} 词</div>
                    </div>

                    <div class="word-grid">
                        <div v-for="(word, index) in record.words.slice(0, 5)" :key="index" class="word-chip">
                            <span class="word-en">{{ word.word }}</span>
                            <span class="word-zh">{{ word.meaning || '' }}</span>
                        </div>
                        <div v-if="record.words.length > 5" class="word-chip word-more-chip">
                            <span class="word-en">+{{ record.words.length - 5 }}</span>
                            <span class="word-zh">更多</span>
                        </div>
                    </div>

                    <a-button class="redo-btn" block @click="startDictationFromMaterial(record)">开始听写</a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDictationStore } from '../stores/dictation'
import { message } from 'ant-design-vue'
import { ocrAPI } from '../utils/api'
import { showConfirm } from '../utils/confirm'

const router = useRouter()
const dictationStore = useDictationStore()

const materialRecords = ref<any[]>([])
const isLoading = ref(false)

// 加载听写库记录
const loadMaterialRecords = async () => {
    isLoading.value = true
    try {
        const response = await ocrAPI.getOCRTasks()

        if (response.data.success && response.data.data) {
            // 获取所有OCR任务的详细信息（包括单词列表）
            const tasksWithWords = await Promise.all(
                response.data.data.map(async (task: any) => {
                    try {
                        const wordsResponse = await ocrAPI.getOCRTaskWords(task.id)
                        if (wordsResponse.data.success && wordsResponse.data.data) {
                            // 根据API返回的数据结构，words在data.words字段中
                            return {
                                ...task,
                                words: wordsResponse.data.data.words || [],
                                date: task.createTime ? new Date(task.createTime).toISOString().split('T')[0] : '未知日期'
                            }
                        }
                    } catch (error) {
                        console.error(`获取任务${task.id}的单词列表失败:`, error)
                    }
                    return {
                        ...task,
                        words: [],
                        date: task.createTime ? new Date(task.createTime).toISOString().split('T')[0] : '未知日期'
                    }
                })
            )

            materialRecords.value = tasksWithWords
            console.log('加载听写库记录成功:', materialRecords.value)
        } else {
            console.error('获取OCR任务列表失败:', response.data)
            materialRecords.value = []
        }
    } catch (error) {
        console.error('加载听写库记录失败:', error)
        materialRecords.value = []
    } finally {
        isLoading.value = false
    }
}

// 从听写库开始听写
const startDictationFromMaterial = async (record: any) => {
    try {
        // 如果记录中没有单词数据，重新获取
        if (!record.words || record.words.length === 0) {
            const wordsResponse = await ocrAPI.getOCRTaskWords(record.id)
            if (wordsResponse.data.success && wordsResponse.data.data) {
                // 根据API返回的数据结构，words在data.words字段中
                record.words = wordsResponse.data.data.words || []
            }
        }

        // 转换单词数据格式
        const wordList = record.words.map((word: any) => ({
            english: word.word || word.english,
            chinese: word.meaning || word.chinese,
            phonetic: word.phonetic || '',
            audio: word.audio_en || word.audio || null,
            audio_en: word.audio_en || '',
            audio_zh: word.audio_zh || ''
        }))

        // 设置当前单词列表
        dictationStore.setWords(wordList)

        // 设置教材信息（模拟一个教材对象）
        dictationStore.setTextbook({
            bookName: '听写库',
            press: '未知出版社',
            standard: '未知标准',
            description: '未知描述'
        })

        // 设置单元信息
        dictationStore.setUnit(record.name || record.id)

        // 跳转到听写练习页面
        router.push('/dictation')
    } catch (error) {
        console.error('开始听写失败:', error)
    }
}

// 删除素材记录
const deleteMaterialRecord = (id: number) => {
    // 显示确认对话框
    showConfirm({
        title: '确认删除',
        content: '确定要删除这条素材记录吗？删除后无法恢复。',
        okText: '确定',
        cancelText: '取消',
        async onOk() {
            try {
                const response = await ocrAPI.deleteOCRTask(id)

                if (response.data.success) {
                    materialRecords.value = materialRecords.value.filter((record) => record.id !== id)
                    message.success('删除成功！')
                } else {
                    message.error(response.data.message || '删除失败')
                }
            } catch (error) {
                console.error('删除素材记录失败:', error)
            }
        }
    })
}

// 返回上一页
const goBack = () => {
    router.push('/')
}

// 去拍照页面
const goToUpload = () => {
    router.push('/upload')
}

// 初始化时加载听写库记录
onMounted(() => {
    loadMaterialRecords()
})
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.material-library-page {
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
    padding: 8px 20px 32px;
    overflow-y: auto;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 32px;
    text-align: center;
}

.empty-title {
    font-size: 18px;
    font-weight: 600;
    color: #334155;
    margin: 0 0 12px;
}

.empty-desc {
    font-size: 14px;
    color: #94a3b8;
    line-height: 1.6;
    margin: 0 0 24px;
}

.goto-btn {
    height: 44px;
    padding: 0 32px;
    border-radius: 80px;
    background: linear-gradient(90deg, rgba(123, 104, 255, 0.8) 0%, rgba(51, 112, 255, 0.8) 100%);
    border: none;
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    transition: opacity 0.2s;
}

.goto-btn:hover {
    opacity: 0.9;
    color: #fff;
}

.record-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
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
    margin-bottom: 14px;
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
}

.stat-chip {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px;
}

.stat-chip.total {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
}

.word-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
}

.word-chip {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(102, 126, 234, 0.06);
    border: 1px solid rgba(102, 126, 234, 0.15);
    border-radius: 10px;
    padding: 6px 12px;
    min-width: 64px;
}

.word-more-chip {
    background: rgba(148, 163, 184, 0.08);
    border-color: rgba(148, 163, 184, 0.2);
}

.word-en {
    font-size: 14px;
    font-weight: 600;
    color: #334155;
}

.word-zh {
    font-size: 11px;
    color: #94a3b8;
    margin-top: 2px;
}

.redo-btn {
    height: 44px;
    border-radius: 80px;
    background: linear-gradient(90deg, rgba(123, 104, 255, 0.8) 0%, rgba(51, 112, 255, 0.8) 100%);
    border: none;
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: opacity 0.2s;
}

.redo-btn:hover {
    opacity: 0.9;
    color: #fff;
}
</style>
