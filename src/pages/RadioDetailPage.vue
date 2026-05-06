<template>
    <div class="detail-page">
        <!-- 顶部封面区 -->
        <div class="hero-section" :style="{ backgroundImage: `url(${currentCover})` }">
            <div class="hero-overlay"></div>
            <div class="hero-nav">
                <button class="back-btn" @click="goBack">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
            <div class="hero-info">
                <h1 class="hero-title">{{ radioData?.name }}</h1>
                <p class="hero-sub">共 {{ radioData?.content_list.length }} 章节</p>
            </div>
        </div>

        <!-- 播放器区域 -->
        <div class="player-section">
            <!-- 当前播放信息 -->
            <div class="now-playing">
                <div class="now-playing-label">正在播放</div>
                <div class="now-playing-title">{{ currentChapter?.name }}</div>
            </div>

            <!-- 进度条 -->
            <div class="progress-wrap">
                <span class="time-text">{{ formatTime(currentTime) }}</span>
                <div class="progress-bar" @click="seekAudio" ref="progressBarRef">
                    <div class="progress-track">
                        <div class="progress-fill" :style="{ width: progressPct + '%' }"></div>
                        <div class="progress-thumb" :style="{ left: progressPct + '%' }"></div>
                    </div>
                </div>
                <span class="time-text">{{ formatTime(duration) }}</span>
            </div>

            <!-- 播放控制 -->
            <div class="controls">
                <button class="ctrl-btn" @click="prevChapter" :disabled="currentIdx === 0">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
                    </svg>
                </button>
                <button class="play-btn" @click="togglePlay">
                    <svg v-if="!isPlaying" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                    <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                </button>
                <button class="ctrl-btn" @click="nextChapter" :disabled="currentIdx === (radioData?.content_list.length ?? 1) - 1">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 18l8.5-6L6 6v12z" />
                        <rect x="16" y="6" width="2.5" height="12" rx="1" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- 章节列表 -->
        <div class="chapter-list-section">
            <h3 class="section-title">章节列表</h3>
            <div class="chapter-list">
                <div v-for="(chapter, idx) in radioData?.content_list" :key="chapter.id" class="chapter-item" :class="{ active: idx === currentIdx }" @click="selectChapter(idx)">
                    <div class="chapter-num">
                        <!-- 播放中的动画波形 -->
                        <template v-if="idx === currentIdx && isPlaying">
                            <div class="wave-bars"><span></span><span></span><span></span></div>
                        </template>
                        <template v-else>
                            <svg v-if="idx === currentIdx" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" class="pause-icon">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                            <span v-else class="num-text">{{ idx + 1 }}</span>
                        </template>
                    </div>
                    <div class="chapter-cover">
                        <img :src="getChapterImage(chapter)" :alt="chapter.name" />
                    </div>
                    <div class="chapter-meta">
                        <span class="chapter-name">{{ chapter.name }}</span>
                    </div>
                    <svg v-if="idx !== currentIdx" class="chapter-play-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- 隐藏的 audio 元素 -->
        <audio ref="audioRef" @timeupdate="onTimeUpdate" @loadedmetadata="onMetaLoaded" @ended="onEnded"></audio>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { braodcasting_lsit } from '../assets/data/braodcasting'

const router = useRouter()
const route = useRoute()

// 图片模块
const imageModules = import.meta.glob('../assets/img/*.png', { eager: true, as: 'url' })
const audioModules = import.meta.glob('../assets/audio/*.mp3', { eager: true, as: 'url' })

const resolveImage = (rawUrl: string): string => {
    const key = rawUrl.replace('@/assets', '../assets')
    return (imageModules[key] as string) || ''
}

const resolveAudio = (rawUrl: string): string => {
    const key = rawUrl.replace('@/assets', '../assets')
    return (audioModules[key] as string) || ''
}

// 数据
const radioId = Number(route.params.id)
const radioData = computed(() => braodcasting_lsit.find((r) => r.id === radioId))

// 当前章节
const currentIdx = ref(0)
const currentChapter = computed(() => radioData.value?.content_list[currentIdx.value])
const currentCover = computed(() => resolveImage(currentChapter.value?.url || ''))

const getChapterImage = (chapter: { url: string }) => resolveImage(chapter.url)

// audio 元素
const audioRef = ref<HTMLAudioElement | null>(null)
const progressBarRef = ref<HTMLDivElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

const progressPct = computed(() => {
    if (!duration.value) return 0
    return (currentTime.value / duration.value) * 100
})

const formatTime = (sec: number): string => {
    if (!sec || isNaN(sec)) return '0:00'
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
}

// 加载章节音频
const loadChapter = (idx: number) => {
    if (!audioRef.value || !radioData.value) return
    const chapter = radioData.value.content_list[idx]
    const url = resolveAudio(chapter.audio_url)
    audioRef.value.src = url
    audioRef.value.load()
    currentTime.value = 0
    duration.value = 0
}

const togglePlay = () => {
    if (!audioRef.value) return
    if (isPlaying.value) {
        audioRef.value.pause()
        isPlaying.value = false
    } else {
        audioRef.value.play()
        isPlaying.value = true
    }
}

const selectChapter = (idx: number) => {
    currentIdx.value = idx
    loadChapter(idx)
    audioRef.value?.play()
    isPlaying.value = true
}

const prevChapter = () => {
    if (currentIdx.value > 0) selectChapter(currentIdx.value - 1)
}

const nextChapter = () => {
    const list = radioData.value?.content_list
    if (list && currentIdx.value < list.length - 1) {
        selectChapter(currentIdx.value + 1)
    }
}

const onTimeUpdate = () => {
    currentTime.value = audioRef.value?.currentTime || 0
}

const onMetaLoaded = () => {
    duration.value = audioRef.value?.duration || 0
}

const onEnded = () => {
    isPlaying.value = false
    nextChapter()
}

const seekAudio = (e: MouseEvent) => {
    if (!progressBarRef.value || !audioRef.value || !duration.value) return
    const rect = progressBarRef.value.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audioRef.value.currentTime = pct * duration.value
}

const goBack = () => {
    audioRef.value?.pause()
    router.back()
}

onMounted(() => {
    loadChapter(0)
})

onUnmounted(() => {
    audioRef.value?.pause()
})
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.detail-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(176deg, #eeefff 2.1%, #fff 45.26%);
}

/* 顶部封面英雄区 */
.hero-section {
    position: relative;
    height: 280px;
    background-size: cover;
    background-position: center;
    background-color: #c9d0f0;
    flex-shrink: 0;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.55) 100%);
}

.hero-nav {
    position: relative;
    z-index: 2;
    padding: 16px 20px;
    padding-top: calc(16px + env(safe-area-inset-top));
}

.back-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(8px);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
}

.back-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}

.hero-info {
    position: absolute;
    bottom: 24px;
    left: 20px;
    right: 20px;
    z-index: 2;
}

.hero-title {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 6px;
    line-height: 1.4;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.hero-sub {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
}

/* 播放器 */
.player-section {
    background: #fff;
    border-radius: 24px 24px 0 0;
    margin-top: -20px;
    position: relative;
    z-index: 3;
    padding: 24px 24px 20px;
    box-shadow: 0 -4px 20px rgba(102, 126, 234, 0.1);
}

.now-playing {
    margin-bottom: 20px;
}

.now-playing-label {
    font-size: 11px;
    font-weight: 600;
    color: #667eea;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 4px;
}

.now-playing-title {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.4;
}

/* 进度条 */
.progress-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.time-text {
    font-size: 12px;
    color: #94a3b8;
    font-variant-numeric: tabular-nums;
    min-width: 32px;
}

.progress-bar {
    flex: 1;
    cursor: pointer;
    padding: 8px 0;
}

.progress-track {
    position: relative;
    height: 4px;
    background: #e8eaf0;
    border-radius: 4px;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #7b68ff 0%, #3370ff 100%);
    border-radius: 4px;
    transition: width 0.1s linear;
}

.progress-thumb {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #7b68ff;
    box-shadow: 0 2px 6px rgba(123, 104, 255, 0.4);
    transition: left 0.1s linear;
}

/* 控制按钮 */
.controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
}

.ctrl-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background: rgba(102, 126, 234, 0.07);
    color: #667eea;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
}

.ctrl-btn:hover:not(:disabled) {
    background: rgba(102, 126, 234, 0.14);
}

.ctrl-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.play-btn {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, #7b68ff 0%, #3370ff 100%);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(123, 104, 255, 0.4);
    transition: all 0.2s;
}

.play-btn:hover {
    transform: scale(1.06);
    box-shadow: 0 8px 28px rgba(123, 104, 255, 0.5);
}

.play-btn:active {
    transform: scale(0.96);
}

/* 章节列表 */
.chapter-list-section {
    flex: 1;
    padding: 20px 24px 40px;
}

.section-title {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 16px;
}

.chapter-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.chapter-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border-radius: 16px;
    padding: 12px 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid rgba(102, 126, 234, 0.08);
}

.chapter-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(102, 126, 234, 0.12);
}

.chapter-item.active {
    background: linear-gradient(135deg, rgba(123, 104, 255, 0.08) 0%, rgba(51, 112, 255, 0.08) 100%);
    border-color: rgba(123, 104, 255, 0.2);
}

.chapter-num {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.num-text {
    font-size: 13px;
    font-weight: 600;
    color: #94a3b8;
}

.pause-icon {
    color: #7b68ff;
}

/* 播放波形动画 */
.wave-bars {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 16px;
}

.wave-bars span {
    width: 3px;
    background: #7b68ff;
    border-radius: 2px;
    animation: wave 0.8s ease-in-out infinite;
}

.wave-bars span:nth-child(1) {
    height: 8px;
    animation-delay: 0s;
}
.wave-bars span:nth-child(2) {
    height: 14px;
    animation-delay: 0.15s;
}
.wave-bars span:nth-child(3) {
    height: 6px;
    animation-delay: 0.3s;
}

@keyframes wave {
    0%,
    100% {
        transform: scaleY(1);
    }
    50% {
        transform: scaleY(1.8);
    }
}

.chapter-cover {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    overflow: hidden;
    flex-shrink: 0;
    background: #e8eaf0;
}

.chapter-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.chapter-meta {
    flex: 1;
    min-width: 0;
}

.chapter-name {
    font-size: 14px;
    font-weight: 600;
    color: #334155;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
}

.chapter-item.active .chapter-name {
    color: #7b68ff;
}

.chapter-play-icon {
    color: #cbd5e1;
    flex-shrink: 0;
}
</style>
