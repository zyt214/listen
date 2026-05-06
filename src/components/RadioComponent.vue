<template>
    <div class="radio-page">
        <div class="main-content">
            <!-- 头部 -->
            <div class="page-header">
                <h1 class="page-title">听电台</h1>
                <p class="page-subtitle">名师讲故事，经典伴成长</p>
            </div>

            <!-- 电台列表 -->
            <div class="radio-list">
                <div
                    v-for="item in braodcasting_lsit"
                    :key="item.id"
                    class="radio-card"
                    @click="goDetail(item)"
                >
                    <!-- 封面图 -->
                    <div class="cover-wrap">
                        <img :src="getCoverImage(item)" :alt="item.name" class="cover-img" />
                        <div class="play-badge">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>

                    <!-- 信息 -->
                    <div class="card-info">
                        <h3 class="card-title">{{ item.name }}</h3>
                        <div class="card-meta">
                            <span class="chapter-count">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 18V5l12-2v13" />
                                    <circle cx="6" cy="18" r="3" />
                                    <circle cx="18" cy="16" r="3" />
                                </svg>
                                {{ item.content_list.length }} 章节
                            </span>
                        </div>
                        <div class="chapter-preview">
                            <span
                                v-for="(ch, idx) in item.content_list.slice(0, 2)"
                                :key="idx"
                                class="chapter-tag"
                            >{{ ch.name }}</span>
                            <span v-if="item.content_list.length > 2" class="chapter-tag more">
                                +{{ item.content_list.length - 2 }}
                            </span>
                        </div>
                    </div>

                    <svg class="card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </div>
            </div>
        </div>

        <div class="bottom-nav-spacer"></div>
        <BottomNav />
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { braodcasting_lsit } from '../assets/data/braodcasting'
import BottomNav from './BottomNav.vue'

const router = useRouter()

const imageModules = import.meta.glob('../assets/img/*.png', { eager: true, as: 'url' })

const getCoverImage = (item: typeof braodcasting_lsit[0]): string => {
    const rawUrl = item.content_list[0]?.url || ''
    const key = rawUrl.replace('@/assets', '../assets')
    return (imageModules[key] as string) || ''
}

const goDetail = (item: typeof braodcasting_lsit[0]) => {
    router.push(`/radio/${item.id}`)
}
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.radio-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(176deg, #eeefff 2.1%, #fff 45.26%);
}

.main-content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    padding-bottom: 80px;
}

/* 头部 */
.page-header {
    margin-bottom: 28px;
    padding-top: 8px;
}

.page-title {
    font-size: 26px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 4px;
    letter-spacing: -0.3px;
}

.page-subtitle {
    font-size: 14px;
    color: #94a3b8;
    margin: 0;
}

/* 列表 */
.radio-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.radio-card {
    display: flex;
    align-items: center;
    gap: 16px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border-radius: 20px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 2px 10px rgba(102, 126, 234, 0.08);
    border: 1px solid rgba(102, 126, 234, 0.1);
}

.radio-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
}

.radio-card:active {
    transform: scale(0.98);
}

/* 封面 */
.cover-wrap {
    position: relative;
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    border-radius: 14px;
    overflow: hidden;
    background: linear-gradient(135deg, #e8e8ff 0%, #f0f7ff 100%);
}

.cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.play-badge {
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(123, 104, 255, 0.92) 0%, rgba(51, 112, 255, 0.92) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
}

/* 卡片信息 */
.card-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.card-title {
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-meta {
    display: flex;
    align-items: center;
}

.chapter-count {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #667eea;
    font-weight: 600;
    background: rgba(102, 126, 234, 0.08);
    padding: 2px 8px;
    border-radius: 20px;
}

.chapter-preview {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.chapter-tag {
    font-size: 11px;
    color: #64748b;
    background: rgba(100, 116, 139, 0.07);
    border-radius: 6px;
    padding: 2px 7px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
}

.chapter-tag.more {
    color: #94a3b8;
}

/* 箭头 */
.card-arrow {
    color: #cbd5e1;
    flex-shrink: 0;
}

.bottom-nav-spacer {
    height: 80px;
    flex-shrink: 0;
}
</style>
