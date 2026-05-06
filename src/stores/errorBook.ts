import { defineStore } from 'pinia'
import { ref } from 'vue'

interface ErrorWord {
    english: string
    chinese: string
    dictationWord?: string
    recognizedWord?: string
    audio_en?: string | null
    audio_zh?: string | null
}

export interface ErrorBookRecord {
    id: string
    date: string
    textbook: string
    unit: string
    totalWords: number
    correctCount: number
    errorCount: number
    wrongWords: ErrorWord[]
}

export const useErrorBookStore = defineStore('errorBook', () => {
    const records = ref<ErrorBookRecord[]>([])

    const loadFromStorage = () => {
        try {
            const stored = localStorage.getItem('errorBookRecords')
            if (stored) {
                records.value = JSON.parse(stored)
            }
        } catch (error) {
            console.error('加载错题本记录失败:', error)
            records.value = []
        }
    }

    const saveToStorage = () => {
        try {
            localStorage.setItem('errorBookRecords', JSON.stringify(records.value))
        } catch (error) {
            console.error('保存错题本记录失败:', error)
        }
    }

    const addRecord = (record: Omit<ErrorBookRecord, 'id' | 'date'>) => {
        const newRecord: ErrorBookRecord = {
            ...record,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('zh-CN')
        }
        records.value.unshift(newRecord)
        saveToStorage()
        return newRecord.id
    }

    const deleteRecord = (id: string) => {
        const index = records.value.findIndex((r) => r.id === id)
        if (index !== -1) {
            records.value.splice(index, 1)
            saveToStorage()
        }
    }

    const clearAll = () => {
        records.value = []
        saveToStorage()
    }

    loadFromStorage()

    return {
        records,
        addRecord,
        deleteRecord,
        clearAll
    }
})
