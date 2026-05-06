<template>
    <div id="app">
        <!-- 路由视图 -->
        <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
                <div v-if="Component">
                    <component :is="Component" />
                </div>
            </transition>
        </router-view>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Speech from 'speak-tts'
import router from './router'
import { message } from 'ant-design-vue'
import { useAuthStore } from './stores/auth'

// 初始化TTS
const speech = new Speech()

// 单词数据接口
interface Word {
    english: string
    chinese: string
    userAnswer?: string
    selected?: boolean
    addToErrorBook?: boolean
}

// 保存到本地词库
const saveToLocalLibrary = (wordList: Word[]) => {
    // 从本地存储加载现有词库
    const existingLibrary = localStorage.getItem('wordLibrary')
    let library = existingLibrary ? JSON.parse(existingLibrary) : []

    // 去重并添加新单词
    wordList.forEach((word) => {
        const exists = library.some((item: Word) => item.english === word.english)
        if (!exists) {
            library.push(word)
        }
    })

    // 保存回本地存储
    localStorage.setItem('wordLibrary', JSON.stringify(library))
}

// 从本地存储加载错误单词
const loadErrorBook = (): Word[] => {
    const savedErrorBook = localStorage.getItem('errorBook')
    return savedErrorBook ? JSON.parse(savedErrorBook) : []
}

// 添加到错题本
const addToErrorBook = (word: Word) => {
    const errorBook = loadErrorBook()
    const exists = errorBook.some((item: Word) => item.english === word.english)
    if (!exists) {
        errorBook.push(word)
        localStorage.setItem('errorBook', JSON.stringify(errorBook))
    }
    return errorBook
}

// 标记已掌握
const markAsMastered = (index: number): Word[] => {
    const errorBook = loadErrorBook()
    errorBook.splice(index, 1)
    localStorage.setItem('errorBook', JSON.stringify(errorBook))
    return errorBook
}

// 打乱数组
const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
}

// 播放音频
const playAudio = (text: string) => {
    // 使用speak-tts进行语音合成
    if (speech && speech?.isInitialized) {
        speech
            .speak({
                text: text,
                lang: 'en-US',
                voice: 'Google US English',
                rate: 0.8,
                pitch: 1,
                volume: 1
            })
            .catch((err) => {
                console.error('TTS speak failed:', err)
                // 回退到Web Speech API
                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(text)
                    utterance.lang = 'en-US'
                    // 尝试使用更标准的语音
                    const voices = window.speechSynthesis.getVoices()
                    const usVoice = voices.find((voice) => voice.lang === 'en-US' || voice.name.includes('US'))
                    if (usVoice) {
                        utterance.voice = usVoice
                    }
                    utterance.rate = 0.8
                    utterance.pitch = 1
                    speechSynthesis.speak(utterance)
                } else {
                    message.info(`播放: ${text}`)
                }
            })
    } else {
        // 回退到Web Speech API
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.lang = 'en-US'
            // 尝试使用更标准的语音
            const voices = window.speechSynthesis.getVoices()
            const usVoice = voices.find((voice) => voice.lang === 'en-US' || voice.name.includes('US'))
            if (usVoice) {
                utterance.voice = usVoice
            }
            utterance.rate = 0.8
            utterance.pitch = 1
            speechSynthesis.speak(utterance)
        } else {
            message.info(`播放: ${text}`)
        }
    }
}

// 导出函数供其他组件使用
defineExpose({
    saveToLocalLibrary,
    loadErrorBook,
    addToErrorBook,
    markAsMastered,
    shuffleArray,
    playAudio
})

// 组件挂载时初始化
onMounted(() => {
    // 初始化 auth store，检查登录状态
    const authStore = useAuthStore()
    authStore.checkAuth()

    // 初始化TTS
    if (speech) {
        speech
            .init({
                lang: 'en-US',
                voice: 'Google US English', // 使用更标准的英语语音
                rate: 0.8, // 稍微减慢语速，提高清晰度
                pitch: 1,
                volume: 1
            })
            .then(() => {
                console.log('TTS initialized successfully')
            })
            .catch((err) => {
                console.error('TTS initialization failed:', err)
            })
    }
})
</script>

<style scoped>
/* 全局样式 */
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100vh;
    overflow: scroll;
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* 滚动条样式优化 */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #cbd5e1 0%, #94a3b8 100%);
    border-radius: 3px;
    transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #94a3b8 0%, #64748b 100%);
}

::-webkit-scrollbar-corner {
    background: transparent;
}

/* Firefox 滚动条样式 */
* {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 transparent;
}
</style>
