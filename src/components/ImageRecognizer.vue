<template>
    <div class="image-recognizer">
        <div class="header">
            <a-button type="text" class="back-btn" @click="goBack">
                <LeftOutlined />
            </a-button>
            <h2 class="header-title">拍照识别</h2>
            <div class="header-spacer"></div>
        </div>

        <div class="content">
            <!-- 上传选项 -->
            <div class="upload-section">
                <div class="upload-options">
                    <div class="upload-option photo" @click="takePhoto">
                        <div class="option-icon camera-icon"></div>
                        <span class="option-text">拍照</span>
                    </div>
                    <div class="upload-option album" @click="selectImage">
                        <div class="option-icon album-icon"></div>
                        <span class="option-text">相册</span>
                    </div>
                </div>
            </div>

            <input type="file" accept="image/*" @change="handleFileUpload" class="file-input" ref="fileInput" />
            <input type="file" accept="image/*" capture @change="handleFileUpload" class="file-input" ref="cameraInput" />

            <!-- 图片预览 -->
            <div v-if="uploadedImages.length > 0" class="preview-section">
                <h3 class="section-title">已选图片 ({{ uploadedImages.length }})</h3>
                <div class="image-preview">
                    <div v-for="(image, index) in uploadedImages" :key="index" class="image-item">
                        <img :src="image" alt="上传的图片" />
                        <div class="scanning-line"></div>
                        <button class="delete-btn" @click="deleteImage(index)">×</button>
                    </div>
                </div>
            </div>

            <!-- 识别进度 -->
            <div v-if="isRecognizing" class="progress-section">
                <div class="progress-info">
                    <span class="progress-text">正在识别...</span>
                    <span class="progress-percent">{{ recognitionProgress }}%</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" :style="{ width: recognitionProgress + '%' }"></div>
                </div>
            </div>

            <!-- 识别结果预览 -->
            <div v-if="recognizedWords.length > 0" class="result-section">
                <h3 class="section-title">识别结果 ({{ recognizedWords.length }}个单词)</h3>
                <div class="word-list">
                    <div v-for="(word, index) in recognizedWords" :key="index" class="word-item">
                        <div v-if="!word.isEditing" class="word-content">
                            <div class="word-english">{{ word.english }}</div>
                            <div class="word-chinese">{{ word.chinese }}</div>
                        </div>
                        <div v-else class="word-edit">
                            <input type="text" v-model="word.english" class="word-input english" placeholder="英文单词" />
                            <input type="text" v-model="word.chinese" class="word-input chinese" placeholder="中文释义" />
                        </div>
                        <div class="word-actions">
                            <Button v-if="!word.isEditing" type="default" size="small" @click="toggleEdit(word)" style="margin-right: 8px">
                                <span class="btn-text">编辑</span>
                            </Button>
                            <Button v-else type="default" size="small" @click="toggleEdit(word)" style="margin-right: 8px">
                                <span class="btn-text">保存</span>
                            </Button>
                            <Button danger size="small" @click="deleteWord(index)">
                                <span class="btn-text">删除</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
                <a-button type="default" block @click="goToMaterialLibrary" class="common-btn"> 查看听写库 </a-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { LeftOutlined } from '@ant-design/icons-vue'
import { message, Button } from 'ant-design-vue'
import { useDictationStore } from '../stores/dictation'
import { ocrAPI } from '../utils/api'

interface Word {
    english: string
    chinese: string
}

const router = useRouter()
const dictationStore = useDictationStore()

const uploadedImages = ref<string[]>([])
const isRecognizing = ref(false)
const isSaving = ref(false)
const recognitionProgress = ref(0)
const recognizedWords = ref<Word[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const cameraInput = ref<HTMLInputElement | null>(null)

const goBack = () => {
    router.back()
}

const goToMaterialLibrary = () => {
    router.push('/material')
}

const takePhoto = () => {
    cameraInput.value?.click()
}

const selectImage = () => {
    fileInput.value?.click()
}

onMounted(() => {
    // 组件挂载时直接唤起拍照功能
    takePhoto()
})

const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const files = target.files
    if (!files || files.length === 0) return

    // 检查已上传图片数量
    if (uploadedImages.value.length >= 5) {
        message.warning('单次最多上传 5 张图片')
        return
    }

    // 只处理单个文件
    const file = files[0]

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
        message.warning('请选择图片文件')
        return
    }

    // 读取图片
    const reader = new FileReader()
    reader.onload = (e) => {
        if (e.target?.result) {
            uploadedImages.value.push(e.target.result as string)

            // 保存图片到 sessionStorage 并跳转到识别页面
            sessionStorage.setItem('ocr_images', JSON.stringify(uploadedImages.value))
            router.push('/ocr-result')
        }
    }
    reader.readAsDataURL(file)

    // 清空input，允许重复选择相同文件
    target.value = ''
}

const deleteImage = (index: number) => {
    uploadedImages.value.splice(index, 1)
}

interface Word {
    english: string
    chinese: string
}

const translateWords = async (words: string[]): Promise<Word[]> => {
    // 1. 将单词数组映射为 Promise 数组 (并发发起请求)
    const translationPromises = words.map(async (word): Promise<Word> => {
        try {
            const response = await fetch(`/youdao/jsonapi?q=${encodeURIComponent(word)}`)
            const data = await response.json()

            let chinese = '未知'

            // 解析有道翻译结果
            if (data?.individual?.trs?.length) {
                chinese = data.individual.trs.map((t: any) => t.tran).join('; ')
            }

            // 取前两条释义，避免过长
            chinese = chinese.split('；').slice(0, 1).join('；')

            return {
                english: word,
                chinese: chinese
            }
        } catch (error) {
            console.error(`翻译失败: ${word}`, error)
            // 即使单个失败，也返回正常结构，保证 Promise.all 不会中断
            return {
                english: word,
                chinese: '翻译失败'
            }
        }
    })

    // 2. 等待所有并发请求完成
    return Promise.all(translationPromises)
}

/**
 * 调用OCR.space API识别图片文字
 * @param {string} base64Image 图片base64
 * @param {string} language 识别语言，eng=英文，chs=简体中文
 * @returns {Promise<string>} 识别到的纯文本
 */
const ocrSpaceApi = async (base64Image, language = 'eng') => {
    const API_KEY = 'K86075366888957'
    const API_URL = 'https://api.ocr.space/parse/image'

    // 处理base64，去掉前缀
    const base64Data = base64Image.replace(/^data:image\/[a-z]+;base64,/, '')

    const formData = new FormData()
    formData.append('apikey', API_KEY)
    formData.append('language', language)
    formData.append('base64Image', `data:image/png;base64,${base64Data}`)
    formData.append('isOverlayRequired', false) // 不需要文字坐标
    formData.append('scale', true) // 自动缩放提升识别率
    formData.append('OCREngine', 2) // 引擎2对小字体/表格识别更优

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        })
        const result = await response.json()

        if (result.OCRExitCode !== 1) {
            throw result.ErrorMessage || '识别失败'
        }

        // 拼接识别到的所有文本
        return result.ParsedResults[0]?.TextOverlay?.Lines?.map((item) => item.LineText) || []
    } catch (error) {
        console.error('OCR识别失败:', error)
        throw error || '识别失败'
    }
}

const parseWordListText = (rawText: string[]) => {
    if (!rawText) return []

    const lines = rawText
        .map((line) =>
            line
                .trim()
                .replace(/[-•.*_]+/g, '')
                .replace(/\s+/g, ' ')
        )
        .filter((line) => {
            // 严格过滤无效行
            if (/^[A-Za-z]$/.test(line)) return false
            // 2. 过滤纯数字行 (整行只有数字)
            if (/^\d+$/.test(line)) return false
            // 3. 过滤包含中文的行
            if (/[\u4e00-\u9fa5]/.test(line)) return false
            return true
        })

    // 简单去重
    return lines.filter((item, index, self) => index === self.findIndex((i) => i === item))
}

// 【适配你之前的业务逻辑】替换原识别函数的示例
const recognizeTextbookWordList = async (base64Image) => {
    try {
        console.log('=== 开始识别单词索引表 ===')
        // 1. 调用OCR API识别文本
        const rawText = await ocrSpaceApi(base64Image, 'eng')
        console.log('识别到的原始文本:', rawText)

        // 2. 复用之前的解析逻辑，提取单词+页码
        console.log('解析单词数据...')
        const wordList = parseWordListText(rawText) // 直接用你之前的解析函数

        console.log('✅ 识别完成！共提取单词:', wordList.length)
        console.log('识别结果:', wordList)
        return wordList
    } catch (error) {
        throw error || '识别失败'
    }
}

// 切换编辑状态
const toggleEdit = (word) => {
    word.isEditing = !word.isEditing
}

// 删除单词
const deleteWord = (index) => {
    recognizedWords.value.splice(index, 1)
}

const startRecognition = async () => {
    if (uploadedImages.value.length === 0) return

    isRecognizing.value = true
    recognitionProgress.value = 0
    recognizedWords.value = []

    try {
        const allWords: string[] = []
        const totalImages = uploadedImages.value.length

        for (let i = 0; i < totalImages; i++) {
            const image = uploadedImages.value[i]

            // 更新进度 - 图片处理阶段
            recognitionProgress.value = Math.round((i / totalImages) * 30)

            const words = await recognizeTextbookWordList(image)
            allWords.push(...words)

            // 更新进度 - OCR阶段
            recognitionProgress.value = Math.round(((i + 1) / totalImages) * 60)
        }

        // 更新进度为翻译阶段
        recognitionProgress.value = 70

        // 翻译单词
        const translatedWords = await translateWords(allWords)
        recognizedWords.value = translatedWords

        recognitionProgress.value = 100

        message.success(`识别完成，共提取到 ${translatedWords.length} 个单词`)
    } catch (error) {
        console.error('识别失败:', error)
        message.error('识别失败，请重试')
    } finally {
        isRecognizing.value = false
    }
}

// MiniMax TTS API配置
const MINIMAX_API_KEY =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiLljJfkuqzniLHmmK_mnKrmnaXnp5HmioDmnInpmZDlhazlj7giLCJVc2VyTmFtZSI6InVnIiwiQWNjb3VudCI6InVnQDE5Mjc5NzEwNDg0ODYwODQ2NzAiLCJTdWJqZWN0SUQiOiIxOTI1MTIzMjAzMTY5MDAxNTMzIiwiUGhvbmUiOiIiLCJHcm91cElEIjoiMTkyNzk3MTA0ODQ4NjA4NDY3MCIsIlBhZ2VOYW1lIjoiIiwiTWFpbCI6IiIsIkNyZWF0ZVRpbWUiOiIyMDI1LTA2LTA2IDEwOjA4OjMwIiwiVG9rZW5UeXBlIjoxLCJpc3MiOiJtaW5pbWF4In0.pcGSRM7Fe-yWUteZh6XMps0gSrfmi_XkXSxzevfN2jBE2jIwWfg0dO4LxTntswOFsYODVlksTRm8-XH1nSv3xburoJEDJGZCqjNPCKxKz5AngoLGS39q8hlkKfxVWWVqJO-19iS9P3jEOAJof9XFlULPdDUtADPLxCimcjahQqoc1D3XTAO1g8hf5VLuJsys-q4dvKtvolqg54Zd5gy5AoakJlXR0BZIY377PSBLAyAhMcdRflq2Vexj2X_5oHB5dt2xX9_VmRQkkdk64MRSkv-8N-Hm68FAyYRItqf2UwKUgncmkk0JbUs-Nau8rsy4yFsrFNCrtZ9X__5YtXJt-g'
const MINIMAX_API_URL = 'https://api.minimaxi.com/v1/t2a_v2'

// 合成语音函数（参考dictationUtils.ts实现）
const synthesizeSpeech = async (text: string, lang: string): Promise<string | null> => {
    const maxRetries = 3
    const retryDelay = 1000

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const model = 'speech-2.8-hd'

            const response = await fetch(MINIMAX_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${MINIMAX_API_KEY}`
                },
                body: JSON.stringify({
                    model: model,
                    text: text,
                    stream: false,
                    voice_setting: {
                        voice_id: 'xinyuyanjiang20250625'
                    },
                    audio_setting: {
                        sample_rate: 32000,
                        format: 'mp3',
                        speed: 1.2
                    },
                    output_format: 'url'
                })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                console.error('MiniMax API error:', response.status, errorData)

                // 检查是否是速率限制错误
                if (response.status === 429 || (errorData.status_msg && errorData.status_msg.includes('rate limit'))) {
                    if (attempt < maxRetries) {
                        console.warn(`Rate limit exceeded, retrying in ${retryDelay}ms...`)
                        await new Promise((resolve) => setTimeout(resolve, retryDelay))
                        continue
                    } else {
                        message.error('API 速率限制，请稍后再试')
                        return null
                    }
                }

                message.error(`语音合成失败: ${response.status}`)
                return null
            }

            const data = await response.json()

            if (data.base_resp && data.base_resp.status_code !== 0) {
                console.error('MiniMax API error:', data.base_resp.status_msg)

                // 检查是否是速率限制错误
                if (data.base_resp.status_msg && data.base_resp.status_msg.includes('rate limit')) {
                    if (attempt < maxRetries) {
                        console.warn(`Rate limit exceeded, retrying in ${retryDelay}ms...`)
                        await new Promise((resolve) => setTimeout(resolve, retryDelay))
                        continue
                    } else {
                        message.error('API 速率限制，请稍后再试')
                        return null
                    }
                }

                message.error(`语音合成失败: ${data.base_resp.status_msg}`)
                return null
            }

            if (data.data && data.data.audio) {
                return data.data.audio.replace(/`/g, '')
            }

            console.error('No audio URL in response')
            return null
        } catch (error) {
            console.error('Error synthesizing speech:', error)
            if (attempt < maxRetries) {
                console.warn(`Error occurred, retrying in ${retryDelay}ms...`)
                await new Promise((resolve) => setTimeout(resolve, retryDelay))
                continue
            } else {
                message.error('语音合成请求失败')
                return null
            }
        }
    }

    return null
}

// 保存到听写库（使用OCR API + TTS合成）
const saveToLibrary = async () => {
    if (recognizedWords.value.length === 0) return

    isSaving.value = true

    try {
        // 创建OCR任务
        const timestamp = new Date().getTime()
        const recordName = `素材_${timestamp}`

        const createResponse = await ocrAPI.createOCRTask({ name: recordName })

        if (!createResponse.data.success) {
            throw new Error(createResponse.data.message || '创建OCR任务失败')
        }

        const ocrId = createResponse.data.data.id
        console.log('OCR任务创建成功，ID:', ocrId)
        const wordsToAdd = recognizedWords.value.map((w) => ({
            word: w.english,
            phonetic: '', // 可以留空或从其他地方获取
            meaning: w.chinese,
            audio_zh: '',
            audio_en: ''
        }))

        // 批量合成音频并添加到OCR任务
        // const wordsToAdd = []
        // let synthesizedCount = 0

        // for (let i = 0; i < recognizedWords.value.length; i++) {
        //     const word = recognizedWords.value[i]

        //     // 更新进度
        //     const progress = Math.round((i / recognizedWords.value.length) * 100)
        //     console.log(`合成进度: ${progress}% - 处理单词: ${word.english}`)

        //     // 合成英文音频
        //     const audio_en = await synthesizeSpeech(word.english, 'en-US')

        //     // 合成中文音频
        //     const audio_zh = await synthesizeSpeech(word.chinese, 'zh-CN')

        //     if (audio_en || audio_zh) {
        //         synthesizedCount++
        //     }

        //     wordsToAdd.push({
        //         word: word.english,
        //         phonetic: '', // 可以留空或从其他地方获取
        //         meaning: word.chinese,
        //         audio_zh: audio_zh || '',
        //         audio_en: audio_en || ''
        //     })

        //     // 添加限流延迟，避免API请求过于频繁
        //     await new Promise((resolve) => setTimeout(resolve, 200))
        // }

        const batchResponse = await ocrAPI.batchAddWords(ocrId, { words: wordsToAdd })

        if (!batchResponse.data.success) {
            throw new Error(batchResponse.data.message || '批量添加单词失败')
        }

        // 设置当前单词列表到 dictationStore
        dictationStore.setWords(recognizedWords.value)

        // 设置教材信息（模拟一个教材对象）
        dictationStore.setTextbook({
            bookName: '听写库',
            press: '未知出版社',
            standard: '未知标准',
            description: '未知描述'
        })

        // 设置单元信息
        dictationStore.setUnit(recordName)

        message.success(`成功保存 ${recognizedWords.value.length} 个单词到听写库!`)

        // 跳转到听写练习页面
        router.push('/material')
    } catch (error) {
        console.error('保存失败:', error)
        message.error(`保存失败: ${error.message || '请重试'}`)
    } finally {
        isSaving.value = false
    }
}

onUnmounted(() => {
    // 清理资源
    isRecognizing.value = false
})
</script>

<style scoped>
* {
    box-sizing: border-box;
}
.common-btn {
    border-radius: 80px;
    background: linear-gradient(90deg, #7b68ff 0%, #3370ff 100%);
    font-size: 16px;
    font-weight: 600;
    height: 56px;
    color: #ffffff;
}
.image-recognizer {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #f0f7ff 0%, #e8e8ff 100%);
}

/* 背景装饰 */
.image-recognizer::before {
    content: '';
    position: fixed;
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 50%;
    transform: translate(50%, -50%);
    z-index: 0;
}

.image-recognizer::after {
    content: '';
    position: fixed;
    bottom: 0;
    left: 0;
    width: 150px;
    height: 150px;
    background: rgba(102, 126, 234, 0.05);
    border-radius: 50%;
    transform: translate(-30%, 30%);
    z-index: 0;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
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
    padding: 40px 24px;
    overflow-y: auto;
    position: relative;
    z-index: 1;
}

.section-title {
    font-size: 18px;
    margin-bottom: 24px;
    color: #333;
    font-weight: 600;
    text-align: center;
    letter-spacing: -0.2px;
}

.upload-section {
    margin-bottom: 40px;
    text-align: center;
}

.upload-options {
    display: flex;
    gap: 24px;
    justify-content: center;
    margin-top: 24px;
}

.upload-option {
    flex: 1;
    max-width: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 24px;
    background: #ffffff;
    border: 2px dashed #d1e5fe;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.upload-option:hover {
    background: #f8faff;
    border-color: #667eea;
    transform: translateY(-4px);
    box-shadow: 0 12px 28px -8px rgba(102, 126, 234, 0.2);
}

.photo {
    background: #e6f0ff;
}
.album {
    background: #e6f9f0;
    border-color: #d1f7e5;
}

.option-icon {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    position: relative;
}

.camera-icon {
    background: #e6f0ff;
    position: relative;
}

.camera-icon::before {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    background: #667eea;
    border-radius: 10px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.camera-icon::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 3px solid #667eea;
}

.album-icon {
    background: #e6f9f0;
    position: relative;
}

.album-icon::before {
    content: '';
    position: absolute;
    width: 40px;
    height: 36px;
    background: #66d9a8;
    border-radius: 8px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.album-icon::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 20px;
    background: white;
    border-radius: 4px;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 2px solid #66d9a8;
}

.option-text {
    font-size: 16px;
    color: #333;
    font-weight: 600;
    margin-top: 8px;
}

.file-input {
    display: none;
}

.preview-section {
    margin-bottom: 40px;
}

.image-preview {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
}

.image-item {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background: #f8fafc;
}

.scanning-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #667eea, transparent);
    animation: scan 1.5s ease-in-out infinite;
    z-index: 10;
}

@keyframes scan {
    0%,
    100% {
        top: 0;
    }
    50% {
        top: calc(100% - 3px);
    }
}

.image-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.delete-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(239, 68, 68, 0.9);
    color: white;
    border: none;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.delete-btn:hover {
    background: rgba(220, 38, 38, 1);
    transform: scale(1.1);
}

.progress-section {
    margin-bottom: 40px;
    padding: 24px;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(102, 126, 234, 0.1);
}

.progress-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
}

.progress-text {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
}

.progress-percent {
    font-size: 14px;
    color: #667eea;
    font-weight: 600;
}

.progress-bar-container {
    width: 100%;
    height: 8px;
    background: #f1f5f9;
    border-radius: 4px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 4px;
    transition: width 0.3s ease;
}

.result-section {
    margin-bottom: 40px;
}

.word-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.word-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(102, 126, 234, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.word-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1);
}

.word-content {
    flex: 1;
    min-width: 0;
}

.word-english {
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 6px;
    letter-spacing: -0.2px;
}

.word-chinese {
    font-size: 15px;
    color: #64748b;
    line-height: 1.4;
}

.word-edit {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.word-input {
    padding: 10px 14px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 15px;
    transition: all 0.3s ease;
    background: #f8fafc;
}

.word-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    background: #ffffff;
}

.word-input.english {
    font-weight: 600;
}

.word-actions {
    display: flex;
    align-items: center;
    margin-left: 20px;
}

.btn-icon {
    margin-right: 4px;
    font-size: 16px;
    line-height: 1;
}

.btn-text {
    font-size: 14px;
    line-height: 1;
}

.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 40px;
}
</style>
