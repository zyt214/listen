import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { studyAPI } from '../utils/api'

interface Word {
    english: string
    chinese: string
    audio_en?: string | null
    audio_zh?: string | null
    [key: string]: any
}

interface Textbook {
    bookName: string
    press?: string
    standard?: string
    description?: string
    [key: string]: any
}

interface Unit {
    [key: string]: Word[]
}

interface DictationRecord {
    id: string
    date: string
    createTime?: string
    textbook: string
    unit: string
    wordCount: number
    words: Word[]
    correctCount?: number
    incorrectWords?: Word[]
}

export const useDictationStore = defineStore('dictation', () => {
    const currentGrade = ref<string>('')
    const currentTextbook = ref<Textbook | null>(null)
    const currentUnit = ref<string>('')
    const currentWords = ref<Word[]>([])
    const units = ref<Unit>({})
    const dictationRecords = ref<DictationRecord[]>([])
    const recordsLoading = ref(false)

    const loadStateFromStorage = () => {
        try {
            const storedState = localStorage.getItem('dictationState')
            if (storedState) {
                const state = JSON.parse(storedState)
                currentGrade.value = state.currentGrade || ''
                currentTextbook.value = state.currentTextbook || null
                currentUnit.value = state.currentUnit || ''
                currentWords.value = state.currentWords || []
                units.value = state.units || {}
            }
        } catch (error) {
            console.error('加载听写状态失败:', error)
            currentGrade.value = ''
            currentTextbook.value = null
            currentUnit.value = ''
            currentWords.value = []
            units.value = {}
        }
    }

    const loadRecords = async () => {
        recordsLoading.value = true
        try {
            const response = await studyAPI.getDictationRecords({ page: 1, pageSize: 3 })
            dictationRecords.value = response.data.data || []
        } catch (error) {
            console.error('加载听写记录失败:', error)
            dictationRecords.value = []
        } finally {
            recordsLoading.value = false
        }
    }

    // 兼容旧调用名：现在只恢复当前听写状态，历史记录走 MySQL。
    const loadFromStorage = () => {
        loadStateFromStorage()
    }

    const saveState = () => {
        try {
            const state = {
                currentGrade: currentGrade.value,
                currentTextbook: currentTextbook.value,
                currentUnit: currentUnit.value,
                currentWords: currentWords.value,
                units: units.value
            }
            localStorage.setItem('dictationState', JSON.stringify(state))
        } catch (error) {
            console.error('保存听写状态失败:', error)
        }
    }

    const addDictationRecord = async (record: Omit<DictationRecord, 'id' | 'date' | 'createTime'>) => {
        const response = await studyAPI.createDictationRecord({
            ...record,
            textbookName: record.textbook,
            unitName: record.unit,
            correctCount: record.correctCount || 0,
            words: record.words.map((word) => ({
                word: word.word || word.english,
                meaning: word.meaning || word.chinese,
                audio_en: word.audio_en || '',
                audio_zh: word.audio_zh || '',
                isCorrect: false
            }))
        })
        const newRecord = response.data.data
        dictationRecords.value = [newRecord, ...dictationRecords.value.filter((item) => item.id !== newRecord.id)].slice(0, 3)
        return newRecord
    }

    const clearDictationRecords = async () => {
        await studyAPI.clearDictationRecords()
        dictationRecords.value = []
    }

    const recentRecords = computed(() => {
        return dictationRecords.value
    })

    const setGrade = (grade: string) => {
        currentGrade.value = grade
        saveState()
    }

    const setTextbook = (textbook: Textbook) => {
        currentTextbook.value = textbook
        saveState()
    }

    const setUnit = (unitName: string) => {
        currentUnit.value = unitName
        saveState()
    }

    const setWords = (words: Word[]) => {
        currentWords.value = words
        saveState()
    }

    const setUnits = (unitData: Unit) => {
        units.value = unitData
        saveState()
    }

    const clearDictation = () => {
        currentGrade.value = ''
        currentTextbook.value = null
        currentUnit.value = ''
        currentWords.value = []
        units.value = {}
        saveState()
    }

    loadStateFromStorage()

    return {
        currentGrade,
        currentTextbook,
        currentUnit,
        currentWords,
        units,
        dictationRecords,
        recordsLoading,
        recentRecords,
        setGrade,
        setTextbook,
        setUnit,
        setWords,
        setUnits,
        clearDictation,
        addDictationRecord,
        clearDictationRecords,
        loadRecords,
        loadFromStorage
    }
})
