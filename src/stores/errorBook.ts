import { defineStore } from 'pinia'
import { ref } from 'vue'
import { studyAPI } from '../utils/api'

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
    const loading = ref(false)

    const loadRecords = async () => {
        loading.value = true
        try {
            const response = await studyAPI.getErrorBookRecords()
            records.value = response.data.data || []
        } catch (error) {
            console.error('加载错题本记录失败:', error)
            records.value = []
        } finally {
            loading.value = false
        }
    }

    const addRecord = async (record: Omit<ErrorBookRecord, 'id' | 'date'>) => {
        const response = await studyAPI.createErrorBookRecord({
            ...record,
            sourceType: 'photo_correction'
        })
        const newRecord = response.data.data
        records.value.unshift(newRecord)
        return newRecord.id
    }

    const deleteRecord = async (id: string) => {
        await studyAPI.deleteErrorBookRecord(id)
        records.value = records.value.filter((record) => record.id !== id)
    }

    const clearAll = async () => {
        await studyAPI.clearErrorBookRecords()
        records.value = []
    }

    return {
        records,
        loading,
        loadRecords,
        addRecord,
        deleteRecord,
        clearAll
    }
})
