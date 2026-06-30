import { message } from 'ant-design-vue'
import { integrationAPI, textbookAPI } from '../utils/api'
interface Word {
    id: number
    english: string
    chinese: string
    audio_en: string | null
    audio_zh: string | null
}

interface DictationOptions {
    words: Word[]
    onProgress?: (currentIndex: number, total: number) => void
    onComplete?: () => void
    onError?: (error: Error) => void
    onCountdownStart?: () => void
    onCountdownUpdate?: (count: number) => void
    onCountdownEnd?: () => void
}

interface BatchSynthesizeProgress {
    current: number
    total: number
    currentWord: string
    isEnglish: boolean
}

interface MiniMaxTTSResponse {
    base_resp?: {
        status_code: number
        status_msg: string
    }
    data?: {
        audio: string
        status: number
        ced: string
    }
    extra_info?: {
        audio_length: number
        audio_sample_rate: number
        audio_size: number
        bitrate: number
        word_count: number
        invisible_character_ratio: number
        usage_characters: number
        audio_format: string
        audio_channel: number
    }
    trace_id?: string
}

class DictationManager {
    private currentWordIndex = 0
    private isPaused = false
    private isReadEnglish = true
    private words: Word[] = []
    private options: DictationOptions
    private audioElement: HTMLAudioElement | null = null
    // Token-based cancellation: increment to cancel all in-flight async steps
    private token = 0
    private activeTimer: number | null = null

    constructor(options: DictationOptions) {
        this.options = options
        this.words = options.words
    }

    setApiKey(key: string) {
        console.warn('MiniMax API Key is managed by server environment variables.')
    }

    setAudioElement(element: HTMLAudioElement) {
        this.audioElement = element
    }

    async initialize(): Promise<boolean> {
        try {
            return true
        } catch (error) {
            console.error('TTS initialization failed:', error)
            this.options.onError?.(error as Error)
            return false
        }
    }

    getCurrentWord(): string {
        if (this.words.length > 0 && this.currentWordIndex < this.words.length) {
            return this.isReadEnglish
                ? this.words[this.currentWordIndex].english
                : this.words[this.currentWordIndex].chinese
        }
        return ''
    }

    getCurrentWordIndex(): number {
        return this.currentWordIndex
    }

    getTotalWords(): number {
        return this.words.length
    }

    isPlaying(): boolean {
        return !this.isPaused
    }

    setReadMode(readEnglish: boolean) {
        this.isReadEnglish = readEnglish
        if (!this.isPaused) {
            this.cancelCurrent()
            this.startWordCycle()
        }
    }

    // ─── Core cancellation ───────────────────────────────────────────────────

    private cancelCurrent() {
        this.token++
        if (this.activeTimer !== null) {
            clearTimeout(this.activeTimer)
            this.activeTimer = null
        }
        if (this.audioElement) {
            this.audioElement.pause()
            this.audioElement.currentTime = 0
        }
        // Reset countdown UI immediately
        this.options.onCountdownEnd?.()
    }

    // ─── Async helpers ────────────────────────────────────────────────────────

    /** Resolves true only if the token is still valid after ms delay */
    private sleepToken(ms: number, token: number): Promise<boolean> {
        return new Promise((resolve) => {
            this.activeTimer = window.setTimeout(() => {
                this.activeTimer = null
                resolve(this.token === token)
            }, ms)
        })
    }

    /** Plays audio and resolves true when playback ends, false if cancelled */
    private playAudioAndWait(url: string, token: number): Promise<boolean> {
        return new Promise((resolve) => {
            if (!this.audioElement) {
                resolve(false)
                return
            }
            const ae = this.audioElement
            const cleanup = (result: boolean) => {
                ae.removeEventListener('ended', onEnded)
                ae.removeEventListener('error', onError)
                resolve(result && this.token === token)
            }
            const onEnded = () => cleanup(true)
            const onError = () => cleanup(false)
            ae.addEventListener('ended', onEnded, { once: true })
            ae.addEventListener('error', onError, { once: true })
            ae.src = url
            ae.currentTime = 0
            ae.play().catch(() => cleanup(false))
        })
    }

    // ─── Word cycle ───────────────────────────────────────────────────────────

    private startWordCycle() {
        const token = this.token
        this.playWordCycle(token)
    }

    /**
     * Sequence for one word:
     *   play #1 → wait for ended → sleep 2s → play #2 → wait for ended
     *   → 5s circular countdown (beep each tick) → advance word
     */
    private async playWordCycle(token: number) {
        const word = this.words[this.currentWordIndex]
        if (!word) return

        const audioUrl = this.isReadEnglish ? word.audio_en : word.audio_zh
        if (!audioUrl) {
            console.error('Audio not available for current word')
            message.warning('音频未准备好，请稍后')
            return
        }

        // Play 1st time
        if (!(await this.playAudioAndWait(audioUrl, token))) return

        // 2s gap before second play
        if (!(await this.sleepToken(2000, token))) return

        // Play 2nd time
        if (!(await this.playAudioAndWait(audioUrl, token))) return

        // 5s countdown immediately after 2nd play ends
        this.options.onCountdownStart?.()
        for (let i = 5; i >= 1; i--) {
            if (this.token !== token) return
            this.options.onCountdownUpdate?.(i)
            this.playBeep()
            if (!(await this.sleepToken(1000, token))) return
        }
        if (this.token !== token) return
        this.options.onCountdownEnd?.()

        // Advance to next word or complete
        if (this.currentWordIndex < this.words.length - 1) {
            this.currentWordIndex++
            this.options.onProgress?.(this.currentWordIndex, this.words.length)
            this.playWordCycle(this.token)
        } else {
            this.options.onComplete?.()
        }
    }

    // ─── Public controls ──────────────────────────────────────────────────────

    togglePause(): boolean {
        this.isPaused = !this.isPaused
        if (this.isPaused) {
            this.cancelCurrent()
        } else {
            this.startWordCycle()
        }
        return this.isPaused
    }

    prevWord() {
        if (this.currentWordIndex > 0) {
            this.cancelCurrent()
            this.currentWordIndex--
            this.options.onProgress?.(this.currentWordIndex, this.words.length)
            if (!this.isPaused) {
                this.startWordCycle()
            }
        }
    }

    nextWord() {
        this.cancelCurrent()
        if (this.currentWordIndex < this.words.length - 1) {
            this.currentWordIndex++
            this.options.onProgress?.(this.currentWordIndex, this.words.length)
            if (!this.isPaused) {
                this.startWordCycle()
            }
        } else {
            this.options.onComplete?.()
        }
    }

    /** Replay current word from scratch */
    playCurrentWord() {
        if (!this.isPaused) {
            this.cancelCurrent()
            this.startWordCycle()
        }
    }

    start() {
        this.isPaused = false
        this.startWordCycle()
    }

    stop() {
        this.cancelCurrent()
        this.isPaused = true
    }

    destroy() {
        this.stop()
    }

    // ─── Beep ─────────────────────────────────────────────────────────────────

    playBeep() {
        try {
            if (!window.AudioContext && !(window as any).webkitAudioContext) {
                console.warn('AudioContext not supported, skipping beep')
                return
            }
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
            const audioContext = new AudioContextClass()
            if (audioContext.state === 'suspended') {
                audioContext
                    .resume()
                    .then(() => this.playBeepInternal(audioContext))
                    .catch((err) => console.warn('Failed to resume AudioContext:', err))
            } else {
                this.playBeepInternal(audioContext)
            }
        } catch (error) {
            console.warn('Failed to play beep:', error)
        }
    }

    private playBeepInternal(audioContext: AudioContext) {
        try {
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()
            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.1)
        } catch (error) {
            console.warn('Failed to play beep internal:', error)
        }
    }

    // ─── Batch synthesis ──────────────────────────────────────────────────────

    async batchSynthesizeAudio(onProgress?: (progress: BatchSynthesizeProgress) => void): Promise<boolean> {
        const wordsToUpdate: any[] = []
        let synthesizedCount = 0

        try {
            for (let i = 0; i < this.words.length; i++) {
                const word = this.words[i]
                let hasUpdated = false

                if (!word.audio_en) {
                    onProgress?.({
                        current: synthesizedCount + 1,
                        total: this.words.length * 2,
                        currentWord: word.english,
                        isEnglish: true
                    })
                    const englishAudio = await this.synthesizeSpeech(word.english, 'en-US')
                    if (englishAudio) {
                        word.audio_en = englishAudio
                        hasUpdated = true
                    }
                    await this.sleep(100)
                }

                if (!word.audio_zh) {
                    onProgress?.({
                        current: synthesizedCount + 1,
                        total: this.words.length * 2,
                        currentWord: word.chinese,
                        isEnglish: false
                    })
                    const chineseAudio = await this.synthesizeSpeech(word.chinese, 'zh-CN')
                    if (chineseAudio) {
                        word.audio_zh = chineseAudio
                        hasUpdated = true
                    }
                    await this.sleep(100)
                }

                if (hasUpdated) {
                    wordsToUpdate.push(word)
                    synthesizedCount++
                }
            }

            if (wordsToUpdate.length > 0) {
                await textbookAPI.batchUpdateWordAudio({
                    words: wordsToUpdate.map((word) => ({
                        id: word.id,
                        word: word.english,
                        audio_zh: word.audio_zh,
                        audio_en: word.audio_en
                    }))
                })
                console.log(`批量合成完成，更新了 ${wordsToUpdate.length} 个单词的音频`)
            } else {
                console.log('所有单词的音频都已存在，无需更新')
            }

            return true
        } catch (error) {
            console.error('Error batch synthesizing audio:', error)
            message.error('批量生成音频失败')
            return false
        }
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    private async synthesizeSpeech(text: string, _lang: string): Promise<string | null> {
        const maxRetries = 3
        const retryDelay = 1000

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await integrationAPI.synthesizeSpeech({ text, lang: _lang })
                const data = response.data?.data

                if (data?.audio) {
                    return data.audio
                }

                console.error('No audio URL in response')
                return null
            } catch (error) {
                console.error('Error synthesizing speech:', error)
                if (attempt < maxRetries) {
                    console.warn(`Error occurred, retrying in ${retryDelay}ms...`)
                    await this.sleep(retryDelay)
                    continue
                } else {
                    message.error('语音合成请求失败')
                    return null
                }
            }
        }

        return null
    }
}

export { DictationManager, type DictationOptions, type BatchSynthesizeProgress }
