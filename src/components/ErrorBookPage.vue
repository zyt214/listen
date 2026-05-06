<template>
    <div class="error-book-page">
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
            <h1 class="nav-title">错题本</h1>
            <div class="nav-right">
                <!-- <a-button v-if="records.length > 0" type="text" class="clear-btn" @click="confirmClearAll">
                    清空
                </a-button> -->
            </div>
        </div>

        <div class="content">
            <div v-if="records.length == 0" class="empty-state">
                <img src="@/assets/img/svg/empty.svg" alt="" />
                <h3 class="empty-title">暂无错题记录</h3>
                <p class="empty-desc">完成听写并拍照批改后，点击"一键加入错题本"即可保存错题</p>
            </div>

            <div v-else class="record-list">
                <div v-for="record in records" :key="record.id" class="record-card">
                    <div class="record-header">
                        <div class="record-meta">
                            <span class="record-date">{{ record.date }}</span>
                            <span class="record-source">{{ record.textbook }} · {{ record.unit }}</span>
                        </div>
                        <a-button type="text" class="delete-btn" @click="confirmDelete(record.id)">
                            <svg data-v-d4875792="" width="16" height="16" viewBox="0 0 24 24" fill="none"><path data-v-d4875792="" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        </a-button>
                    </div>

                    <div class="record-stats">
                        <div class="stat-chip total">共 {{ record.totalWords }} 词</div>
                        <div class="stat-chip correct">✓ {{ record.correctCount }}</div>
                        <div class="stat-chip error">✗ {{ record.errorCount }}</div>
                    </div>

                    <div class="word-grid">
                        <div v-for="(word, idx) in record.wrongWords" :key="idx" class="word-chip">
                            <span class="word-en">{{ word.english }}</span>
                            <span class="word-zh">{{ word.chinese }}</span>
                        </div>
                    </div>

                    <a-button class="redo-btn" block @click="redoDictation(record)"> 重新听写 </a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { showConfirm } from '../utils/confirm'
import { useErrorBookStore, type ErrorBookRecord } from '../stores/errorBook'
import { useDictationStore } from '../stores/dictation'

const router = useRouter()
const errorBookStore = useErrorBookStore()
const dictationStore = useDictationStore()

const records = computed(() => errorBookStore.records)

const goBack = () => router.back()

const confirmDelete = (id: string) => {
    showConfirm({
        title: '删除记录',
        content: '确定要删除这条错题记录吗？',
        okText: '删除',
        cancelText: '取消',
        onOk() {
            errorBookStore.deleteRecord(id)
            message.success('已删除')
        }
    })
}

const confirmClearAll = () => {
    showConfirm({
        title: '清空错题本',
        content: '确定要清空所有错题记录吗？此操作不可恢复。',
        okText: '清空',
        cancelText: '取消',
        onOk() {
            errorBookStore.clearAll()
            message.success('已清空')
        }
    })
}

const redoDictation = (record: ErrorBookRecord) => {
    const words = record.wrongWords.map((w) => ({
        english: w.english,
        chinese: w.chinese,
        audio_en: w.audio_en || null,
        audio_zh: w.audio_zh || null
    }))
    dictationStore.setWords(words as any)
    dictationStore.setUnit(`错题复习 - ${record.unit}`)
    if (record.textbook) {
        dictationStore.setTextbook({
            bookName: record.textbook,
            press: '',
            standard: '',
            description: ''
        })
    }
    router.push('/dictation')
}
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.error-book-page {
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

.clear-btn {
    color: #ff4d4f;
    font-size: 14px;
    height: auto;
    padding: 6px 10px;
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

.empty-icon {
    font-size: 64px;
    margin-bottom: 20px;
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
    margin: 0;
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

.stat-chip.correct {
    background: rgba(82, 196, 26, 0.1);
    color: #52c41a;
}

.stat-chip.error {
    background: rgba(255, 77, 79, 0.1);
    color: #ff4d4f;
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
    background: rgba(255, 77, 79, 0.06);
    border: 1px solid rgba(255, 77, 79, 0.15);
    border-radius: 10px;
    padding: 6px 12px;
    min-width: 64px;
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

.redo-icon {
    font-size: 16px;
}
</style>
