<template>
    <div class="home-page">
        <div class="main-content">
            <!-- 主要功能区 -->
            <div class="main-functions">
                <div class="function-card blue" @click="router.push('/upload')">
                    <div class="function-content">
                        <h2 class="function-title">拍照听写</h2>
                        <p class="function-subtitle">拍照/上传，自动识别</p>
                        <div class="function-icon camera">
                            <img src="@/assets/img/svg/camera.svg" alt="camera.svg" />
                        </div>
                    </div>
                </div>
                <div class="function-card green" @click="router.push('/textbook')">
                    <div class="function-content">
                        <h2 class="function-title">教材听写</h2>
                        <p class="function-subtitle">人教版·同步教材听写</p>
                        <div class="function-icon book">
                            <img src="@/assets/img/svg/script.svg" alt="textbook.svg" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 快捷入口 -->
            <div class="quick-section">
                <h2 class="section-title">快捷入口</h2>
                <div class="quick-grid">
                    <div class="quick-item material" @click="router.push('/material')">
                        <div class="quick-icon-wrap">
                            <img src="@/assets/img/svg/material.svg" alt="material.svg" />
                        </div>
                        <div class="quick-info">
                            <span class="quick-title">听写库</span>
                            <span class="quick-desc">学习素材</span>
                        </div>
                        <svg class="quick-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </div>
                    <div class="quick-item error-book" @click="router.push('/errorBook')">
                        <div class="quick-icon-wrap">
                            <img src="@/assets/img/svg/errorbook.svg" alt="errorbook.svg" />
                        </div>
                        <div class="quick-info">
                            <span class="quick-title">错题本</span>
                            <span class="quick-desc">{{ errorBookCount > 0 ? `${errorBookCount} 条记录` : '暂无记录' }}</span>
                        </div>
                        <svg class="quick-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- 百宝箱 -->
            <div class="treasure-section">
                <h2 class="section-title">百宝箱</h2>
                <div class="quick-grid">
                    <div class="quick-item essay" @click="router.push('/essay')">
                        <div class="quick-icon-wrap">
                            <img src="@/assets/img/svg/composition.svg" alt="write.svg" />
                        </div>
                        <div class="quick-info">
                            <span class="quick-title">写作文</span>
                            <span class="quick-desc">AI 生成作文</span>
                        </div>
                        <svg class="quick-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </div>
                    <div class="quick-item vocabulary" @click="router.push('/vocabulary')">
                        <div class="quick-icon-wrap">
                            <img src="@/assets/img/svg/icon3.svg" alt="" />
                        </div>
                        <div class="quick-info">
                            <span class="quick-title">背单词</span>
                            <span class="quick-desc">轻松练读写</span>
                        </div>
                        <svg class="quick-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </div>
                    <!-- <div class="quick-item ai-story" @click="router.push('/ai-story')">
                        <div class="quick-icon-wrap">
                            <img src="@/assets/img/svg/icon1.png" style="height: auto !important" alt="" />
                        </div>
                        <div class="quick-info">
                            <span class="quick-title">AI 绘本</span>
                            <span class="quick-desc">自己可以创造</span>
                        </div>
                        <svg class="quick-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </div> -->
                    <div class="quick-item radio" @click="router.push('/radio')">
                        <div class="quick-icon-wrap">
                            <img src="@/assets/img/svg/icon2.svg" alt="radio.svg" />
                        </div>
                        <div class="quick-info">
                            <span class="quick-title">听电台</span>
                            <span class="quick-desc">名师讲故事</span>
                        </div>
                        <svg class="quick-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Banner 位 -->
            <div class="banner" @click="() => router.push('test')">
                <img src="@/assets/img/banner.png" alt="听写天天练" class="banner-image" />
            </div>

            <!-- 最近听写 -->
            <div class="recent-section">
                <h2 class="section-title">最近听写</h2>
                <div class="recent-list">
                    <div v-if="recentItems.length === 0" class="empty-recent">
                        <img class="empty-icon" src="@/assets/img/svg/empty.svg" alt="listen.svg" />
                        <p class="empty-text">暂无听写记录</p>
                        <p class="empty-hint">开始你的听写之旅吧</p>
                        <a-button type="primary" class="empty-btn common-btn" @click="router.push('/textbook')">开始听写</a-button>
                    </div>
                    <div v-else v-for="item in recentItems" :key="item.id" class="recent-item">
                        <div class="recent-info">
                            <h3 class="recent-title">{{ item.textbook }} - {{ item.unit }}</h3>
                            <p class="recent-meta">{{ formatCreateTime(item.createTime) }} · {{ item.wordCount }}个词</p>
                        </div>
                        <a-button type="primary" class="recent-btn" @click="continueDictation(item)">继续听写</a-button>
                    </div>
                </div>
            </div>
        </div>

        <div class="bottom-nav-spacer"></div>
        <BottomNav />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { useDictationStore } from '../stores/dictation'
import { useAuthStore } from '../stores/auth'
import { useErrorBookStore } from '../stores/errorBook'
import { showConfirm } from '../utils/confirm'
import BottomNav from './BottomNav.vue'

const router = useRouter()
const dictationStore = useDictationStore()
const authStore = useAuthStore()
const errorBookStore = useErrorBookStore()
const { recentRecords: recentItems } = storeToRefs(dictationStore)

const errorBookCount = computed(() => errorBookStore.records.length)

onMounted(async () => {
    await Promise.all([dictationStore.loadRecords(), errorBookStore.loadRecords()])
})

const formatCreateTime = (createTime?: string) => {
    if (!createTime) return '未知时间'

    const time = dayjs(createTime)
    return time.isValid() ? time.format('YYYY-MM-DD HH:mm') : createTime
}

// 继续学习功能
const continueDictation = (record: any) => {
    // 设置当前单词列表
    dictationStore.setWords(record.words)

    // 设置教材信息（模拟一个教材对象）
    dictationStore.setTextbook({
        bookName: record.textbook,
        press: '未知出版社',
        standard: '未知标准',
        description: '未知描述'
    })

    // 设置单元信息
    dictationStore.setUnit(record.unit)

    // 跳转到听写练习页面
    router.push('/dictation')
}

// 退出登录功能
const handleLogout = () => {
    showConfirm({
        title: '确认退出',
        content: '确定要退出登录吗？',
        okText: '退出',
        onOk: () => {
            authStore.logout()
            message.success('退出登录成功')
            router.push('/login')
        }
    })
}
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.home-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(176deg, #eeefff 2.1%, #fff 45.26%);
    box-sizing: border-box;
    padding-bottom: 20px; /* 给底部导航留出空间 */
}

.main-content {
    flex: 1;
    padding: 24px;
    box-sizing: border-box;
    overflow-y: auto;
    padding-bottom: 80px;
}

/* Banner 位 */
.banner {
    background: linear-gradient(135deg, #8fa0e6 0%, #7a8fd4 100%);
    border-radius: 20px;
    /* padding: 32px 24px; */
    margin-bottom: 24px;
    color: white;
    text-align: center;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(138, 160, 230, 0.25); /* 阴影颜色也改为与背景同色系，更通透 */
}
.banner-title {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px 0;
    line-height: 1.2;
}

.banner-subtitle {
    font-size: 16px;
    margin: 0;
    opacity: 0.9;
    line-height: 1.4;
}

.banner-image {
    max-width: 100%;
    height: auto;
}

.user-info {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 16px;
    gap: 12px;
}

.username {
    font-size: 14px;
    font-weight: 600;
    color: white;
    opacity: 0.9;
}

.user-info .ant-btn {
    color: white;
    border-color: white;
}

.user-info .ant-btn:hover {
    color: #ff4d4f;
    border-color: #ff4d4f;
}

/* 主要功能区 */
.main-functions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
}

.function-card {
    border-radius: 20px;
    padding: 24px;
    color: #08021e;
    cursor: pointer;
}

.function-card.blue {
    background: linear-gradient(169deg, rgba(212, 209, 255, 0.5) 8.19%, rgba(244, 237, 255, 0.5) 91.81%);

    /* background: #fff8f1; */
}

/* 牛油果绿 */
.function-card.green {
    /* background: linear-gradient(180deg, #9edcff 0%, #ecf8ff 100%); */
    background: linear-gradient(180deg, rgba(158, 220, 255, 0.5) 0%, rgba(236, 248, 255, 0.5) 100%);

    /* background: #ebfdf7; */
}

.function-content {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.function-title {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 4px 0;
    line-height: 1.2;
}

.function-subtitle {
    font-size: 14px;
    margin: 0 0 16px 0;
    opacity: 0.9;
    line-height: 1.4;
    color: #58585c;
}

.function-icon {
    margin-top: auto;
    align-self: flex-end;
}

.function-icon img {
    width: 48px;
    height: 48px;
    opacity: 0.8;
}

/* 快捷操作 */
.quick-section {
    margin-bottom: 24px;
}
.section-title {
    font-size: 18px;
    margin: 16px 0;
    padding-top: 10px;
    color: #1e293b;
    font-weight: 500;
}
.quick-grid {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    flex-wrap: wrap;
}

.quick-item {
    width: 48%;
    display: flex;
    align-items: center;
    gap: 14px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border-radius: 16px;
    padding: 16px 18px;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 2px 10px rgba(102, 126, 234, 0.08);
    border: 1px solid rgba(102, 126, 234, 0.1);
}

.quick-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(102, 126, 234, 0.15);
}

.quick-item:active {
    transform: scale(0.98);
}

.quick-icon-wrap {
    width: 30px;
    height: 30px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.quick-icon-wrap img {
    width: 100%;
    height: 100%;
}

/* .quick-item.material .quick-icon-wrap {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
}

.quick-item.error-book .quick-icon-wrap {
    background: linear-gradient(135deg, rgba(240, 147, 251, 0.15) 0%, rgba(245, 87, 108, 0.15) 100%);
} */

.quick-emoji {
    font-size: 22px;
    line-height: 1;
}

.quick-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.quick-title {
    font-size: 15px;
    font-weight: 600;
    color: #334155;
}

.quick-desc {
    font-size: 12px;
    color: #94a3b8;
}

.quick-arrow {
    color: #cbd5e1;
    flex-shrink: 0;
}

/* 百宝箱 */
.treasure-section {
    margin-bottom: 24px;
}

/* 为百宝箱项目添加背景色 */
/* .quick-item.essay .quick-icon-wrap {
    background: #e3f2fd;
}

.quick-item.vocabulary .quick-icon-wrap {
    background: #ffebee;
}

.quick-item.ai-story .quick-icon-wrap {
    background: #e3f2fd;
}

.quick-item.radio .quick-icon-wrap {
    background: #f3e5f5;
} */

/* 最近听写 */
.feature-section {
    margin-bottom: 24px;
}

.recent-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.recent-item {
    background: white;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recent-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.recent-icon {
    font-size: 24px;
    line-height: 1;
}

.recent-info {
    flex: 1;
}

.recent-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 4px 0;
    color: #333;
    line-height: 1.3;
}

.recent-meta {
    font-size: 14px;
    margin: 0;
    color: #666;
    line-height: 1.4;
}

.recent-btn {
    border-radius: 12px !important;
    padding: 8px 16px !important;
    line-height: 12px !important;
    border-radius: 80px !important;
    background: linear-gradient(90deg, rgba(123, 104, 255, 0.8) 0%, rgba(51, 112, 255, 0.8) 100%);
    color: white;
}

.empty-recent {
    background: white;
    border-radius: 16px;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    line-height: 1;
}

.empty-text {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #333;
    line-height: 1.3;
}

.empty-hint {
    font-size: 14px;
    margin: 0 0 20px 0;
    color: #666;
    line-height: 1.4;
    max-width: 280px;
}

.common-btn {
    border-radius: 80px !important;
    padding: 10px 24px !important;
    line-height: 12px !important;
    background: linear-gradient(90deg, rgba(123, 104, 255, 0.8) 0%, rgba(51, 112, 255, 0.8) 100%);
    color: white;
    border: none;
}

/* 底部导航 */
.bottom-nav-spacer {
    height: 80px;
    flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .main-functions {
        grid-template-columns: 1fr 1fr;
        gap: 16px;
    }

    .treasure-grid {
        grid-template-columns: 1fr 1fr;
    }

    .banner {
        /* padding: 24px 16px; */
    }

    .banner-title {
        font-size: 24px;
    }

    .main-content {
        padding: 14px;
    }

    .modal-content {
        margin: 20px;
    }

    .modal-body {
        padding: 20px;
    }
}
</style>
