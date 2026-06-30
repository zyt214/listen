<template>
    <div class="dictation-page">
        <!-- 背景装饰 -->
        <div class="bg-decoration">
            <div class="bg-circle bg-circle-1"></div>
            <div class="bg-circle bg-circle-2"></div>
            <div class="bg-circle bg-circle-3"></div>
        </div>

        <!-- 顶部导航 -->
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
            <h1 class="nav-title">听写练习</h1>
            <div class="nav-right"></div>
        </div>

        <div class="content">
            <!-- 批量获取音频 Loading 界面 -->
            <div v-if="isLoadingAudio" class="loading-container">
                <div class="loading-card">
                    <!-- Icon -->
                    <div class="loading-icon-wrap">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                        </svg>
                    </div>

                    <!-- Title -->
                    <h2 class="loading-title">正在准备音频</h2>
                    <p class="loading-subtitle">请稍等，音频准备中...</p>

                    <!-- Progress numbers -->
                    <div class="loading-count-row">
                        <span class="loading-count-current">{{ loadingProgress.current }}</span>
                        <span class="loading-count-sep">/</span>
                        <span class="loading-count-total">{{ loadingProgress.total }}</span>
                    </div>

                    <!-- Progress bar -->
                    <div class="loading-track">
                        <div class="loading-fill" :style="{ width: `${loadingProgress.total > 0 ? (loadingProgress.current / loadingProgress.total) * 100 : 0}%` }"></div>
                    </div>

                    <!-- Current word chip -->
                    <div v-if="loadingProgress.currentWord" class="loading-word-chip">
                        <span class="loading-word-label">正在处理</span>
                        <span class="loading-word-text">{{ loadingProgress.currentWord }}</span>
                    </div>
                </div>
            </div>

            <!-- 倒计时界面 -->
            <div v-else-if="isCountingDown" class="countdown-container">
                <div class="glass-card countdown-card">
                    <div class="countdown-icon">
                        <span class="icon-text">⏰</span>
                    </div>
                    <div class="countdown-text">{{ countdown }}</div>
                    <div class="countdown-label">准备开始听写</div>
                </div>
            </div>

            <!-- 听写结果页面 -->
            <div v-else-if="isDictationCompleted" class="result-container">
                <div class="glass-card result-card">
                    <div class="result-icon">
                        <span class="icon-text">🎉</span>
                    </div>
                    <div class="result-title">听写完成！</div>
                    <div class="result-stats">
                        <div class="stat-item">
                            <div class="stat-value">{{ words.length }}</div>
                            <div class="stat-label">听写单词数</div>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat-item">
                            <div class="stat-value">{{ formattedDuration }}</div>
                            <div class="stat-label">耗时</div>
                        </div>
                    </div>
                    <div class="result-actions">
                        <a-button size="large" block class="result-btn photo-btn" @click="goToPhotoCorrection"> 拍照批改 </a-button>
                    </div>
                </div>
            </div>

            <!-- 听写界面 -->
            <div v-else class="content-container">
                <!-- 进度卡片 -->
                <div class="glass-card progress-card">
                    <div class="progress-header">
                        <span class="progress-label-text">单词进度</span>
                        <span class="progress-count">{{ currentWordIndex + 1 }} / {{ words.length }}</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" :style="{ width: `${((currentWordIndex + 1) / words.length) * 100}%` }"></div>
                    </div>
                </div>

                <!-- 单词卡片 -->
                <div class="glass-card word-card">
                    <div class="word-text">{{ currentWord }}</div>
                    <div v-if="dictationCountdown > 0" class="countdown-ring-wrap">
                        <svg class="countdown-ring" width="88" height="88" viewBox="0 0 88 88">
                            <defs>
                                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stop-color="#667eea" />
                                    <stop offset="100%" stop-color="#764ba2" />
                                </linearGradient>
                            </defs>
                            <circle class="ring-bg" cx="44" cy="44" r="36" />
                            <circle class="ring-arc" cx="44" cy="44" r="36" :stroke-dasharray="RING_CIRCUMFERENCE" :stroke-dashoffset="ringDashoffset" />
                        </svg>
                        <div class="ring-number">{{ dictationCountdown }}</div>
                    </div>
                </div>

                <!-- 发音模式选择 -->
                <div class="glass-card mode-selector" style="padding: 10px; padding-bottom: 10px">
                    <div class="mode-label">选择发音模式</div>
                    <div class="mode-buttons">
                        <a-button class="mode-btn" :class="{ active: isReadEnglish }" @click="setReadMode(true)">
                            <span class="mode-text">读英文</span>
                        </a-button>
                        <a-button class="mode-btn" :class="{ active: !isReadEnglish }" @click="setReadMode(false)">
                            <span class="mode-text">读中文</span>
                        </a-button>
                    </div>
                </div>

                <!-- 播放控制 - 音乐播放器风格 -->
                <div class="glass-card player-panel">
                    <div class="player-controls">
                        <button class="ctrl-btn prev-btn" @click="prevWord" :disabled="currentWordIndex === 0">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
                            </svg>
                        </button>
                        <button class="ctrl-btn play-btn" @click="togglePause">
                            <svg v-if="isPaused" width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            <svg v-else width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                        </button>
                        <button class="ctrl-btn next-btn" @click="nextWord" :disabled="currentWordIndex === words.length - 1">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 18l8.5-6L6 6v12zm2-8.14 4.96 3.5L8 16.14V9.86zM16 6h2v12h-2z" />
                            </svg>
                        </button>
                    </div>
                    <button class="end-btn" @click="endDictation">结束听写</button>
                </div>
            </div>
        </div>
    </div>

    <!-- 固定的 audio 标签 -->
    <audio ref="audioElement" class="audio-element"></audio>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDictationStore } from '../stores/dictation'
import { message } from 'ant-design-vue'
import { DictationManager, DictationOptions, BatchSynthesizeProgress } from '../utils/dictationUtils'
import { showConfirm } from '../utils/confirm'

const router = useRouter()
const dictationStore = useDictationStore()

let dictationManager: DictationManager | null = null

const currentWordIndex = ref(0)
const isPaused = ref(false)
const isReadEnglish = ref(true)
const isCountingDown = ref(false)
const isLoadingAudio = ref(true)
const isDictationCompleted = ref(false)
const countdown = ref(5)
// 0 = not counting down; 1-5 = current tick shown in circular ring
const dictationCountdown = ref(0)
let countdownTimer: number | null = null

const loadingProgress = ref({
    current: 0,
    total: 0,
    currentWord: '',
    isEnglish: true
})

const words = computed(() => dictationStore.currentWords)
const currentWord = ref('')
const audioElement = ref<HTMLAudioElement | null>(null)

// 听写计时
const dictationStartTime = ref<number>(0)
const dictationDuration = ref<number>(0)
let durationTimer: number | null = null

const formattedDuration = computed(() => {
    const total = Math.floor(dictationDuration.value)
    const minutes = Math.floor(total / 60)
    const seconds = total % 60
    if (minutes > 0) {
        return `${minutes}分${seconds.toString().padStart(2, '0')}秒`
    }
    return `${seconds}秒`
})

// Circular progress ring: radius=36, circumference ≈ 226.2
const RING_CIRCUMFERENCE = 2 * Math.PI * 36
const ringDashoffset = computed(() => {
    if (dictationCountdown.value <= 0) return 0
    // countdown goes 5→4→3→2→1; fill from 0% at 5 to 100% at 1
    const progress = (5 - dictationCountdown.value) / 4
    return RING_CIRCUMFERENCE * (1 - progress)
})

const setReadMode = (readEnglish: boolean) => {
    isReadEnglish.value = readEnglish
    dictationManager?.setReadMode(readEnglish)
    currentWord.value = dictationManager?.getCurrentWord() || ''
}

const goBack = () => {
    router.back()
}

const togglePause = () => {
    if (dictationManager) {
        isPaused.value = dictationManager.togglePause()
        if (isPaused.value) {
            dictationCountdown.value = 0
        }
    }
}

const startCountdown = () => {
    isCountingDown.value = true
    countdown.value = 5

    countdownTimer = window.setInterval(() => {
        dictationManager?.playBeep()

        if (countdown.value > 1) {
            countdown.value--
        } else {
            clearInterval(countdownTimer!)
            countdownTimer = null
            isCountingDown.value = false
            startDictation()
        }
    }, 1000)
}

const startDictation = () => {
    if (words.value.length > 0 && dictationManager) {
        if (dictationStore.currentTextbook && dictationStore.currentUnit && dictationStore.currentWords.length > 0) {
            dictationStore.addDictationRecord({
                textbook: dictationStore.currentTextbook.bookName,
                unit: dictationStore.currentUnit,
                wordCount: dictationStore.currentWords.length,
                words: dictationStore.currentWords
            }).catch((error) => {
                console.error('保存听写记录失败:', error)
            })
        }
        currentWord.value = dictationManager.getCurrentWord() || ''
        dictationStartTime.value = Date.now()
        dictationDuration.value = 0
        durationTimer = window.setInterval(() => {
            dictationDuration.value = Math.floor((Date.now() - dictationStartTime.value) / 1000)
        }, 1000)
        dictationManager.start()
    }
}

const goToPhotoCorrection = () => {
    router.push('/photo-correction')
}

const goHome = () => {
    dictationStore.clearDictation()
    router.push('/')
}

const prevWord = () => {
    dictationCountdown.value = 0
    dictationManager?.prevWord()
    currentWord.value = dictationManager?.getCurrentWord() || ''
}

const nextWord = () => {
    dictationCountdown.value = 0
    dictationManager?.nextWord()
    currentWord.value = dictationManager?.getCurrentWord() || ''
}

const endDictation = () => {
    showConfirm({
        title: '确认结束听写',
        content: '确定要结束当前听写练习吗？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
            dictationManager?.stop()
            if (countdownTimer !== null) {
                clearInterval(countdownTimer)
                countdownTimer = null
            }
            if (durationTimer !== null) {
                clearInterval(durationTimer)
                durationTimer = null
            }
            if (dictationStartTime.value > 0) {
                dictationDuration.value = Math.floor((Date.now() - dictationStartTime.value) / 1000)
            }
            isDictationCompleted.value = true
        }
    })
}

const loadAudio = async () => {
    isLoadingAudio.value = true
    loadingProgress.value = {
        current: 0,
        total: words.value.length * 2,
        currentWord: '',
        isEnglish: true
    }

    try {
        const success = await dictationManager!.batchSynthesizeAudio((progress: BatchSynthesizeProgress) => {
            loadingProgress.value = {
                current: progress.current,
                total: progress.total,
                currentWord: progress.currentWord,
                isEnglish: progress.isEnglish
            }
        })

        if (success) {
            isLoadingAudio.value = false
            startCountdown()
        } else {
            message.error('音频准备失败，请重试')
            router.back()
        }
    } catch (error) {
        console.error('Error loading audio:', error)
        message.error('音频准备失败，请重试')
        router.back()
    }
}

onMounted(async () => {
    const options: DictationOptions = {
        words: words.value as any,
        onProgress: (index: number, _total: number) => {
            currentWordIndex.value = index
            currentWord.value = dictationManager?.getCurrentWord() || ''
        },
        onComplete: () => {
            if (durationTimer !== null) {
                clearInterval(durationTimer)
                durationTimer = null
            }
            dictationDuration.value = Math.floor((Date.now() - dictationStartTime.value) / 1000)
            isDictationCompleted.value = true
        },
        onError: (error: Error) => {
            console.error('Dictation error:', error)
            message.error('听写过程中出现错误')
        },
        onCountdownStart: () => {
            dictationCountdown.value = 5
        },
        onCountdownUpdate: (count: number) => {
            dictationCountdown.value = count
        },
        onCountdownEnd: () => {
            dictationCountdown.value = 0
        }
    }

    dictationManager = new DictationManager(options)

    if (audioElement.value) {
        dictationManager.setAudioElement(audioElement.value)
    }

    await dictationManager.initialize()
    await loadAudio()
})

onUnmounted(() => {
    if (countdownTimer !== null) {
        clearInterval(countdownTimer)
        countdownTimer = null
    }
    if (durationTimer !== null) {
        clearInterval(durationTimer)
        durationTimer = null
    }
    dictationManager?.destroy()
    dictationManager = null
})
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.dictation-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #f0f7ff 0%, #e8e8ff 100%);
    position: relative;
    overflow-x: hidden;
}

/* 背景装饰 */
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    top: -80px;
    right: -60px;
    animation: float 8s ease-in-out infinite;
}

.bg-circle-2 {
    width: 220px;
    height: 220px;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    bottom: 30%;
    left: -70px;
    animation: float 10s ease-in-out infinite reverse;
}

.bg-circle-3 {
    width: 180px;
    height: 180px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    bottom: -40px;
    right: 15%;
    animation: float 12s ease-in-out infinite;
}

@keyframes float {
    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }
    50% {
        transform: translateY(-20px) rotate(5deg);
    }
}

/* 导航栏 */
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
    width: 50px;
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
    transform: scale(1.05);
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

/* 玻璃卡片 */
.glass-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(102, 126, 234, 0.15);
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
}

.loading-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 24px;
}

.loading-card {
    width: 100%;
    max-width: 360px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border-radius: 24px;
    padding: 36px 28px;
    border: 1px solid rgba(102, 126, 234, 0.1);
    box-shadow: 0 2px 10px rgba(102, 126, 234, 0.08);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
}

.loading-icon-wrap {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(90deg, rgba(123, 104, 255, 0.9) 0%, rgba(51, 112, 255, 0.9) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    box-shadow: 0 6px 20px rgba(123, 104, 255, 0.35);
    animation: loading-pulse 1.6s ease-in-out infinite;
}

@keyframes loading-pulse {
    0%,
    100% {
        transform: scale(1);
        box-shadow: 0 6px 20px rgba(123, 104, 255, 0.35);
    }
    50% {
        transform: scale(1.07);
        box-shadow: 0 10px 32px rgba(123, 104, 255, 0.5);
    }
}

.loading-title {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 6px 0;
    text-align: center;
    letter-spacing: -0.3px;
}

.loading-subtitle {
    font-size: 13px;
    color: #94a3b8;
    margin: 0 0 24px 0;
    text-align: center;
}

.loading-count-row {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 4px;
    margin-bottom: 12px;
}

.loading-count-current {
    font-size: 32px;
    font-weight: 700;
    color: #7b68ff;
    line-height: 1;
}

.loading-count-sep {
    font-size: 16px;
    color: #cbd5e1;
    font-weight: 500;
}

.loading-count-total {
    font-size: 22px;
    font-weight: 600;
    color: #64748b;
    line-height: 1;
}

.loading-track {
    width: 100%;
    height: 8px;
    background: rgba(123, 104, 255, 0.1);
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 20px;
}

.loading-fill {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, rgba(123, 104, 255, 0.9) 0%, rgba(51, 112, 255, 0.9) 100%);
    transition: width 0.35s ease;
}

.loading-word-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(123, 104, 255, 0.07);
    border: 1px solid rgba(123, 104, 255, 0.15);
    border-radius: 80px;
    padding: 6px 16px;
}

.loading-word-label {
    font-size: 12px;
    color: #94a3b8;
    font-weight: 500;
}

.loading-word-text {
    font-size: 14px;
    font-weight: 700;
    color: #7b68ff;
}

.countdown-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: calc(100vh - 200px);
    padding: 20px;
}

.countdown-card {
    padding: 48px 32px;
    width: 100%;
    max-width: 360px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.countdown-icon {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 28px;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    animation: pulse 1.5s ease-in-out infinite;
}

.countdown-text {
    font-size: 72px;
    font-weight: 700;
    color: #667eea;
    letter-spacing: -2px;
    margin-bottom: 16px;
    animation: countChange 0.5s ease;
}

@keyframes countChange {
    0% {
        transform: scale(0.5);
        opacity: 0;
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.countdown-label {
    font-size: 18px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.7);
    letter-spacing: -0.3px;
    text-align: center;
}

.content {
    flex: 1;
    padding: 26px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
}

.content-container {
    width: 100%;
}

.progress-card {
    width: 100%;
    background: #ffffff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px;
    border: 1px solid rgba(0, 0, 0, 0.03);
}

.progress-label {
    display: flex;
    align-items: baseline;
    justify-content: center;
    margin-bottom: 12px;
    gap: 4px;
}

.progress-current {
    font-size: 32px;
    font-weight: 700;
    color: #667eea;
    letter-spacing: -1px;
}

.progress-separator {
    font-size: 18px;
    color: #94a3b8;
    font-weight: 500;
}

.progress-total {
    font-size: 24px;
    font-weight: 600;
    color: #64748b;
}

.progress-bar-container {
    width: 100%;
    height: 10px;
    background: #f1f5f9;
    border-radius: 10px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.word-card {
    width: 100%;
    background: #ffffff;
    border-radius: 24px;
    padding: 48px 24px;
    margin-bottom: 24px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid rgba(0, 0, 0, 0.03);
    height: 226px;
}

.word-icon {
    width: 72px;
    height: 72px;
    border-radius: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.icon-text {
    font-size: 36px;
    line-height: 1;
}

.word-text {
    font-size: 40px;
    font-weight: 700;
    color: #1e293b;
    letter-spacing: -1px;
    text-align: center;
}

.word-hint {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    margin-top: 8px;
    text-align: center;
}

.countdown-display {
    margin-top: 16px;
    text-align: center;
}

/* Circular countdown ring */
.countdown-ring-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    width: 88px;
    height: 88px;
}

.countdown-ring {
    transform: rotate(-90deg);
}

.ring-bg {
    fill: none;
    stroke: rgba(102, 126, 234, 0.12);
    stroke-width: 7;
}

.ring-arc {
    fill: none;
    stroke: url(#ringGrad);
    stroke-width: 7;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.9s linear;
}

.ring-number {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 28px;
    font-weight: 700;
    color: #667eea;
    line-height: 1;
    pointer-events: none;
}

.countdown-number {
    font-size: 48px;
    font-weight: 700;
    color: #667eea;
    line-height: 1;
}

.countdown-label {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    margin-top: 4px;
}

.audio-button-container {
    width: 100%;
    margin-bottom: 20px;
}

.audio-button {
    width: 100%;
    height: 56px;
    border-radius: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.audio-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5);
    color: #fff;
    background: linear-gradient(135deg, #7c8ff2 0%, #8b5cb2 100%);
}

.audio-button:active {
    transform: translateY(0);
}

.audio-icon {
    font-size: 24px;
    line-height: 1;
}

.audio-text {
    line-height: 1;
}

.mode-selector {
    width: 100%;
    margin-bottom: 20px;
}

.mode-label {
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 12px;
    text-align: center;
    letter-spacing: -0.2px;
}

.mode-buttons {
    display: flex;
    gap: 12px;
}

.mode-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px 12px;
    border-radius: 80px;
    cursor: pointer;
}

.mode-btn.active {
    border-color: transparent;
    background: linear-gradient(90deg, rgba(123, 104, 255, 0.8) 0%, rgba(51, 112, 255, 0.8) 100%);
}

.mode-icon {
    font-size: 28px;
    margin-bottom: 6px;
    line-height: 1;
}

.mode-text {
    font-size: 14px;
    font-weight: 600;
    color: #475569;
    letter-spacing: -0.2px;
}

.mode-btn.active .mode-text {
    color: #fff;
}

.status-badge {
    padding: 10px 24px;
    border-radius: 50px;
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 32px;
    transition: all 0.3s ease;
}

.status-badge.paused {
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
}

.action-buttons {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.action-btn {
    width: 100%;
    height: 56px;
    border-radius: 16px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn.primary {
    background: #f1f5f9;
    color: #475569;
    border-color: #e2e8f0;
}

.action-btn.primary:hover {
    background: #e2e8f0;
    color: #334155;
    border-color: #cbd5e1;
}

.action-btn.danger {
    background: #fee2e2;
    color: #dc2626;
    border-color: #fecaca;
}

.action-btn.danger:hover {
    background: #fecaca;
    color: #b91c1c;
    border-color: #fca5a5;
}

.action-btn.photo {
    background: #dbeafe;
    color: #1d4ed8;
    border-color: #93c5fd;
}

.action-btn.photo:hover:not(:disabled) {
    background: #93c5fd;
    color: #1e40af;
    border-color: #60a5fa;
}

.action-btn.photo:disabled {
    background: #f1f5f9;
    color: #94a3b8;
    border-color: #e2e8f0;
    cursor: not-allowed;
}

/* 音频元素 */
.audio-element {
    display: none;
}

/* 音乐播放器控制面板 */
.player-panel {
    width: 100%;
    padding: 20px 24px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.player-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 28px;
}

.ctrl-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    color: #475569;
    border-radius: 50%;
    transition: all 0.2s ease;
    padding: 0;
    outline: none;
    -webkit-tap-highlight-color: transparent;
}

.ctrl-btn:disabled {
    color: #cbd5e1;
    cursor: not-allowed;
}

.prev-btn,
.next-btn {
    width: 48px;
    height: 48px;
    background: rgba(102, 126, 234, 0.08);
}

.prev-btn:hover:not(:disabled),
.next-btn:hover:not(:disabled) {
    background: rgba(102, 126, 234, 0.16);
    color: #667eea;
    transform: scale(1.08);
}

.prev-btn:active:not(:disabled),
.next-btn:active:not(:disabled) {
    transform: scale(0.95);
}

.play-btn {
    width: 64px;
    height: 64px;
    background: linear-gradient(90deg, rgba(123, 104, 255, 0.8) 0%, rgba(51, 112, 255, 0.8) 100%);
    color: #fff;
}

.play-btn:hover {
    transform: scale(1.06);
    box-shadow: 0 8px 28px rgba(102, 126, 234, 0.55);
}

.play-btn:active {
    transform: scale(0.96);
    box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
}

.end-btn {
    width: 100%;
    height: 44px;
    border-radius: 80px;
    border: 1.5px solid rgba(220, 38, 38, 0.25);
    background: rgba(254, 226, 226, 0.5);
    color: #dc2626;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.5px;
    transition: all 0.2s ease;
    outline: none;
    -webkit-tap-highlight-color: transparent;
}

.end-btn:hover {
    background: rgba(254, 202, 202, 0.8);
    border-color: rgba(220, 38, 38, 0.4);
}

.end-btn:active {
    transform: scale(0.98);
}

/* 进度卡片标题 */
.progress-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

.progress-label-text {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    letter-spacing: -0.2px;
}

.progress-count {
    font-size: 14px;
    font-weight: 700;
    color: #667eea;
}

/* 听写结果页 */
.result-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: relative;
    top: -50px;
}

.result-card {
    padding: 48px 32px;
    width: 100%;
    max-width: 360px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.result-icon {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    background: linear-gradient(90deg, rgba(123, 104, 255, 0.8) 0%, rgba(51, 112, 255, 0.8) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    /* animation: pulse 1.5s ease-in-out infinite; */
}

.result-title {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin-bottom: 32px;
    letter-spacing: -0.5px;
}

.result-stats {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    width: 100%;
    background: rgba(102, 126, 234, 0.06);
    border-radius: 20px;
    padding: 24px 16px;
    margin-bottom: 32px;
}

.stat-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}

.stat-value {
    font-size: 20px;
    font-weight: 700;
    color: #667eea;
    letter-spacing: -1px;
    line-height: 1;
}

.stat-label {
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
}

.stat-divider {
    width: 1px;
    height: 48px;
    background: rgba(102, 126, 234, 0.2);
    flex-shrink: 0;
}

.result-actions {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.result-btn {
    width: 100%;
    height: 56px;
    border-radius: 80px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.result-btn.photo-btn {
    background: linear-gradient(90deg, rgba(123, 104, 255, 0.8) 0%, rgba(51, 112, 255, 0.8) 100%);
    color: #fff;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.result-btn.home-btn {
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;
}

.retake-btn {
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;
}

.close-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
}
</style>
