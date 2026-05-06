<template>
    <div class="exam-page">
        <div class="header">
            <a-button type="text" class="back-btn" @click="goBack">
                <LeftOutlined />
            </a-button>
            <h2 class="header-title">单词考试</h2>
            <div class="header-spacer"></div>
        </div>

        <div class="content">
            <!-- 倒计时界面 -->
            <div v-if="isCountingDown" class="countdown-container">
                <div class="countdown-card">
                    <div class="countdown-icon">
                        <span class="icon-text">⏰</span>
                    </div>
                    <div class="countdown-text">{{ countdown }}</div>
                    <div class="countdown-label">准备开始考试</div>
                </div>
            </div>

            <!-- 考试界面 -->
            <div class="exam-container" v-else>
                <div class="progress-card">
                    <div class="progress-label">
                        <span class="progress-current">{{ currentWordIndex + 1 }}</span>
                        <span class="progress-separator">/</span>
                        <span class="progress-total">{{ words.length }}</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" :style="{ width: `${((currentWordIndex + 1) / words.length) * 100}%` }"></div>
                    </div>
                </div>

                <div class="word-card">
                    <div class="word-icon">
                        <span class="icon-text">📝</span>
                    </div>
                    <div class="word-text">{{ currentWordToRead }}</div>
                </div>

                <div class="audio-button-container">
                    <a-button class="audio-button" @click="playCurrentWord">
                        <span class="audio-icon">🔊</span>
                        <span class="audio-text">播放发音</span>
                    </a-button>
                </div>

                <div class="mode-selector">
                    <div class="mode-label">选择发音模式</div>
                    <div class="mode-buttons">
                        <button class="mode-btn" :class="{ active: isReadEnglish }" @click="setReadMode(true)">
                            <span class="mode-icon">🔤</span>
                            <span class="mode-text">读英文</span>
                        </button>
                        <button class="mode-btn" :class="{ active: !isReadEnglish }" @click="setReadMode(false)">
                            <span class="mode-icon">🀄</span>
                            <span class="mode-text">读中文</span>
                        </button>
                    </div>
                </div>

                <div class="status-badge" :class="{ paused: isPaused }">
                    {{ isPaused ? '⏸ 已暂停' : '▶ 自动播放中' }}
                </div>

                <div class="action-buttons">
                    <a-button class="action-btn primary" @click="togglePause">
                        {{ isPaused ? '▶ 继续' : '⏸ 暂停' }}
                    </a-button>
                    <a-button class="action-btn danger" @click="endExam"> ✕ 结束考试 </a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Speech from 'speak-tts'
import { useDictationStore } from '../stores/dictation'
import { LeftOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

interface Word {
    english: string
    chinese: string
}

const router = useRouter()
const dictationStore = useDictationStore()

let speech: Speech | null = null
let speechSynthesisInstance: SpeechSynthesis | null = null

const currentWordIndex = ref(0)
const isPaused = ref(false)
const isReadEnglish = ref(true)
const isCountingDown = ref(true)
const countdown = ref(5)
let autoPlayTimer: number | null = null
let countdownTimer: number | null = null

const words = computed(() => dictationStore.currentWords)

const currentWordToRead = computed(() => {
    if (words.value.length > 0 && currentWordIndex.value < words.value.length) {
        return isReadEnglish.value ? words.value[currentWordIndex.value].english : words.value[currentWordIndex.value].chinese
    }
    return ''
})

const setReadMode = (readEnglish: boolean) => {
    isReadEnglish.value = readEnglish
    playCurrentWord()
}

const goBack = () => {
    router.back()
}

const initializeSpeech = async () => {
    try {
        speech = new Speech()
        await speech.init({
            lang: 'en-US',
            voice: 'Google US English',
            rate: 0.8,
            pitch: 1,
            volume: 1
        })
        console.log('TTS initialized successfully')
    } catch (err) {
        console.error('TTS initialization failed:', err)
    }

    if ('speechSynthesis' in window) {
        speechSynthesisInstance = window.speechSynthesis
    }
}

const playCurrentWord = () => {
    if (!currentWordToRead.value) return

    const text = currentWordToRead.value
    const lang = isReadEnglish.value ? 'en-US' : 'zh-CN'
    const voiceName = isReadEnglish.value ? 'Google US English' : 'Google 普通话（中国大陆）'

    if (speech && speech.isInitialized) {
        speech
            .speak({
                text: text,
                lang: lang,
                voice: voiceName,
                rate: 0.8,
                pitch: 1,
                volume: 1
            })
            .catch((err) => {
                console.error('TTS speak failed:', err)
                fallbackSpeech(text, lang)
            })
    } else {
        fallbackSpeech(text, lang)
    }
}

const fallbackSpeech = (text: string, lang: string) => {
    if (speechSynthesisInstance) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = lang

        const voices = speechSynthesisInstance.getVoices()
        let selectedVoice
        if (lang === 'zh-CN') {
            selectedVoice = voices.find((voice) => voice.lang === 'zh-CN' || voice.lang === 'zh' || voice.name.includes('Chinese'))
        } else {
            selectedVoice = voices.find((voice) => voice.lang === 'en-US' || voice.name.includes('US'))
        }
        if (selectedVoice) {
            utterance.voice = selectedVoice
        }

        utterance.rate = 0.8
        utterance.pitch = 1
        speechSynthesisInstance.speak(utterance)
    } else {
        message.info(`播放: ${text}`)
    }
}

const playBeep = () => {
    // 创建滴滴提示音
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
}

const startCountdown = () => {
    isCountingDown.value = true
    countdown.value = 5

    countdownTimer = window.setInterval(() => {
        playBeep()

        if (countdown.value > 1) {
            countdown.value--
        } else {
            clearInterval(countdownTimer!)
            countdownTimer = null
            isCountingDown.value = false
            startExam()
        }
    }, 1000)
}

const startExam = () => {
    if (words.value.length > 0) {
        playCurrentWord()
        startAutoPlay()
    }
}

const togglePause = () => {
    isPaused.value = !isPaused.value

    if (!isPaused.value) {
        playCurrentWord()
        startAutoPlay()
    } else {
        stopAutoPlay()
    }
}

const startAutoPlay = () => {
    stopAutoPlay()
    autoPlayTimer = window.setInterval(() => {
        if (!isPaused.value && currentWordIndex.value < words.value.length - 1) {
            currentWordIndex.value++
            playCurrentWord()
        } else if (!isPaused.value && currentWordIndex.value === words.value.length - 1) {
            // 考试结束
            stopAutoPlay()
            endExam()
        }
    }, 5000)
}

const stopAutoPlay = () => {
    if (autoPlayTimer !== null) {
        clearInterval(autoPlayTimer)
        autoPlayTimer = null
    }
}

const endExam = () => {
    stopAutoPlay()
    if (countdownTimer !== null) {
        clearInterval(countdownTimer)
        countdownTimer = null
    }

    // 跳转到考试结果页面
    router.push('/exam/result')
}

onMounted(async () => {
    await initializeSpeech()
    startCountdown()
})

onUnmounted(() => {
    stopAutoPlay()
    if (countdownTimer !== null) {
        clearInterval(countdownTimer)
        countdownTimer = null
    }
    if (speech) {
        speech.cancel()
    }
    if (speechSynthesisInstance) {
        speechSynthesisInstance.cancel()
    }
})
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.exam-page {
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
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
}
.exam-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.countdown-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.countdown-card {
    background: #ffffff;
    border-radius: 32px;
    padding: 64px 32px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 400px;
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.03);
}

.countdown-icon {
    width: 120px;
    height: 120px;
    border-radius: 60px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    animation: pulse 1s infinite;
}

@keyframes pulse {
    0%,
    100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

.countdown-text {
    font-size: 80px;
    font-weight: 700;
    color: #1e293b;
    letter-spacing: -2px;
    margin-bottom: 16px;
    animation: countChange 0.3s ease;
}

@keyframes countChange {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}

.countdown-label {
    font-size: 20px;
    font-weight: 600;
    color: #64748b;
    letter-spacing: -0.3px;
    text-align: center;
}

.progress-card {
    width: 100%;
    max-width: 400px;
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
    max-width: 400px;
    background: #ffffff;
    border-radius: 24px;
    padding: 48px 24px;
    margin-bottom: 24px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid rgba(0, 0, 0, 0.03);
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

.audio-button-container {
    width: 100%;
    max-width: 400px;
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
    max-width: 400px;
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
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mode-btn:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    transform: translateY(-2px);
}

.mode-btn.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: transparent;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.mode-btn.active:hover {
    background: linear-gradient(135deg, #7c8ff2 0%, #8b5cb2 100%);
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5);
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
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.action-btn {
    width: 100%;
    height: 52px;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 600;
    border: 2px solid transparent;
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
</style>
