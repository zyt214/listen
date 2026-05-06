import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Word {
    english: string
    chinese: string
}

interface Textbook {
    bookName: string
    press: string
    standard: string
    description: string
}

interface Unit {
    [key: string]: Word[]
}

interface DictationRecord {
    id: string
    date: string
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

    // 最大记录数
    const MAX_RECORDS = 3

    // 初始化时从 localStorage 加载记录和当前状态
    const loadFromStorage = () => {
        try {
            // 加载听写记录
            const storedRecords = localStorage.getItem('dictationRecords')
            if (storedRecords) {
                dictationRecords.value = JSON.parse(storedRecords)
            }

            // 加载当前听写状态
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
            console.error('加载听写数据失败:', error)
            dictationRecords.value = []
            currentGrade.value = ''
            currentTextbook.value = null
            currentUnit.value = ''
            currentWords.value = []
            units.value = {}
        }
    }

    // 保存记录到 localStorage
    const saveRecords = () => {
        try {
            localStorage.setItem('dictationRecords', JSON.stringify(dictationRecords.value))
        } catch (error) {
            console.error('保存听写记录失败:', error)
        }
    }

    // 保存当前状态到 localStorage
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

    // 添加听写记录（使用 LRU 算法）
    const addDictationRecord = (record: Omit<DictationRecord, 'id' | 'date'>) => {
        const newRecord: DictationRecord = {
            ...record,
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0]
        }

        // 检查是否已存在相同的记录（基于教材和单元）
        const existingIndex = dictationRecords.value.findIndex((r) => r.textbook === record.textbook && r.unit === record.unit)

        if (existingIndex !== -1) {
            // 如果存在，先移除旧记录
            dictationRecords.value.splice(existingIndex, 1)
        }

        // 添加新记录到开头（最新的记录在最前面）
        dictationRecords.value.unshift(newRecord)

        // 如果超过最大记录数，删除最旧的记录
        if (dictationRecords.value.length > MAX_RECORDS) {
            dictationRecords.value = dictationRecords.value.slice(0, MAX_RECORDS)
        }

        // 保存到 localStorage
        saveRecords()
    }

    // 清除所有听写记录
    const clearDictationRecords = () => {
        dictationRecords.value = []
        saveRecords()
    }

    // 获取最近的听写记录
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

    // 初始化加载记录和状态
    loadFromStorage()

    return {
        currentGrade,
        currentTextbook,
        currentUnit,
        currentWords,
        units,
        dictationRecords,
        recentRecords,
        setGrade,
        setTextbook,
        setUnit,
        setWords,
        setUnits,
        clearDictation,
        addDictationRecord,
        clearDictationRecords,
        loadFromStorage
    }
})
