<template>
  <div class="vocabulary-page">
    <!-- Decorative blur circles -->
    <div class="blur-circle blur-circle-1"></div>
    <div class="blur-circle blur-circle-2"></div>

    <div class="main-content">
      <!-- Page header -->
      <div class="page-header">
        <button class="back-btn" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div class="header-text">
          <h2 class="page-title">背单词</h2>
          <p class="page-subtitle">轻松练读写</p>
        </div>
        <div class="header-spacer"></div>
      </div>

      <!-- ── HOME VIEW ── -->
      <template v-if="currentView === 'home'">
        <!-- Word source selection -->
        <h2 class="section-title">词库来源</h2>
        <div class="source-card">
          <div class="source-tabs">
            <button
              class="source-tab"
              :class="{ 'source-tab-active': sourceType === 'material' }"
              @click="switchSource('material')"
            >
              听写库
            </button>
            <button
              class="source-tab"
              :class="{ 'source-tab-active': sourceType === 'textbook' }"
              @click="switchSource('textbook')"
            >
              教材
            </button>
          </div>

          <div v-if="sourceType === 'material'" class="source-panel">
            <div v-if="materialLoading" class="source-state">正在加载听写库...</div>
            <div v-else-if="materialRecords.length === 0" class="source-state">暂无听写库记录</div>
            <div v-else class="source-list">
              <button
                v-for="record in materialRecords"
                :key="record.id"
                class="source-item"
                :class="{ 'source-item-active': selectedMaterialId === record.id }"
                @click="selectMaterialRecord(record)"
              >
                <span class="source-name">{{ record.name || '未命名素材' }}</span>
                <span class="source-meta">{{ record.words?.length || 0 }} 个单词</span>
              </button>
            </div>
          </div>

          <div v-else class="source-panel">
            <div v-if="textbookLoading" class="source-state">正在加载教材...</div>
            <div v-else-if="textbooks.length === 0" class="source-state">暂无教材</div>
            <template v-else>
              <a-select
                v-model:value="selectedTextbookId"
                class="source-select"
                placeholder="选择教材"
                :bordered="false"
                @change="handleTextbookChange"
              >
                <a-select-option v-for="textbook in textbooks" :key="textbook.id" :value="textbook.id">
                  {{ textbook.bookName }}
                </a-select-option>
              </a-select>

              <div v-if="unitLoading" class="source-state">正在加载单元...</div>
              <div v-else-if="selectedTextbookId && textbookUnits.length === 0" class="source-state">暂无单元</div>
              <div v-else-if="textbookUnits.length > 0" class="source-list">
                <button
                  v-for="unit in textbookUnits"
                  :key="unit.unitName"
                  class="source-item"
                  :class="{ 'source-item-active': selectedUnitName === unit.unitName }"
                  @click="selectTextbookUnit(unit)"
                >
                  <span class="source-name">{{ unit.unitName }}</span>
                  <span class="source-meta">{{ unit.wordCount }} 个单词</span>
                </button>
              </div>
            </template>
          </div>

          <div class="source-current">
            <span class="source-current-label">当前词库</span>
            <strong>{{ selectedSourceTitle }}</strong>
          </div>
        </div>

        <!-- Stats cards -->
        <h2 class="section-title">学习进度</h2>
        <div class="stats-grid">
          <div class="stat-card accent-card">
            <span class="stat-label">已掌握</span>
            <strong class="stat-num">{{ learningStats.mastered }}</strong>
          </div>
          <div class="stat-card">
            <span class="stat-label">学习中</span>
            <strong class="stat-num">{{ learningStats.learning }}</strong>
          </div>
          <div class="stat-card">
            <span class="stat-label">待复习</span>
            <strong class="stat-num">{{ learningStats.reviewing }}</strong>
          </div>
          <div class="stat-card">
            <span class="stat-label">总词数</span>
            <strong class="stat-num">{{ learningStats.total }}</strong>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="progress-card">
          <div class="progress-row">
            <span class="progress-label">平均掌握度</span>
            <strong class="progress-pct">{{ learningStats.progress }}%</strong>
          </div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: `${learningStats.progress}%` }"></div>
          </div>
        </div>

        <!-- Mode selection -->
        <h2 class="section-title">背诵方式</h2>
        <div class="mode-row">
          <div
            class="mode-item"
            :class="{ 'mode-active': studyMode === 'sequential' }"
            @click="setStudyMode('sequential')"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            <span>顺序背诵</span>
          </div>
          <div
            class="mode-item"
            :class="{ 'mode-active': studyMode === 'random' }"
            @click="setStudyMode('random')"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" />
            </svg>
            <span>随机抽取</span>
          </div>
        </div>

        <!-- Session size -->
        <h2 class="section-title">本轮词数</h2>
        <div class="count-card">
          <button class="count-btn" :disabled="sessionWordCount <= minSessionWordCount" @click="adjustSessionWordCount(-1)">-</button>
          <div class="count-display">
            <strong>{{ sessionWordCount }}</strong>
            <span>本轮 {{ sessionWords.length }} 个单词</span>
          </div>
          <button class="count-btn" :disabled="sessionWordCount >= maxSessionWordCount" @click="adjustSessionWordCount(1)">+</button>
        </div>

        <!-- Start button -->
        <button class="start-btn" :disabled="wordBank.length < minSessionWordCount || sourceLoading" @click="startSession">
          {{ startButtonText }}
        </button>
      </template>

      <!-- ── STUDY VIEW ── -->
      <template v-else-if="currentView === 'study' && currentWord">
        <div class="study-card">
          <div class="study-top">
            <div class="study-tag">学习中</div>
            <div class="study-counter">{{ currentIndex + 1 }} / {{ sessionWords.length }}</div>
          </div>
          <div class="word-display">
            <h2 class="word-text">{{ currentWord.word }}</h2>
            <p class="word-phonetic">{{ currentWord.phonetic }}</p>
          </div>
          <div class="meaning-area" v-if="showMeaning">
            <p class="word-meaning">{{ currentWord.meaning }}</p>
          </div>
          <div class="study-actions">
            <button class="action-btn ghost-btn" :disabled="progressSaving" @click="showMeaning = !showMeaning">
              {{ showMeaning ? '隐藏释义' : '查看释义' }}
            </button>
            <button class="action-btn ghost-btn" :disabled="currentIndex === 0 || progressSaving" @click="goPrev">上一个</button>
            <button class="action-btn primary-btn" :disabled="progressSaving" @click="goNext">下一个</button>
          </div>
        </div>
      </template>

      <!-- ── QUIZ VIEW ── -->
      <template v-else-if="currentView === 'quiz' && currentQuestion">
        <div class="quiz-card">
          <div class="study-top">
            <div class="study-tag">测验阶段</div>
            <div class="study-counter">{{ quizIndex + 1 }} / {{ quizQuestions.length }}</div>
          </div>
          <p class="quiz-prompt-label">选择单词的正确释义</p>
          <div class="quiz-word-block">
            <h2 class="word-text">{{ currentQuestion.word }}</h2>
            <p class="word-phonetic">{{ currentQuestion.phonetic }}</p>
          </div>
          <div class="options-list">
            <button
              v-for="option in currentQuestion.options"
              :key="option"
              class="option-btn"
              :class="{ 'option-selected': selectedAnswer === option }"
              @click="selectedAnswer = option"
            >
              {{ option }}
            </button>
          </div>
          <button class="start-btn" :disabled="!selectedAnswer || progressSaving" @click="submitQuizAnswer">
            提交答案
          </button>
        </div>
      </template>

      <!-- ── SUMMARY VIEW ── -->
      <template v-else-if="currentView === 'summary'">
        <div class="summary-card">
          <h2 class="summary-title">学习完成 🎉</h2>
          <div class="score-ring">
            <strong class="score-num">{{ summary.score }}/{{ summary.total }}</strong>
            <span class="score-label">正确率 {{ summary.accuracy }}%</span>
          </div>
          <div class="summary-stats">
            <div class="summary-stat-item">
              <span>本轮掌握</span>
              <strong>{{ summary.learnedThisRound }}</strong>
            </div>
            <div class="summary-stat-item">
              <span>测验题数</span>
              <strong>{{ summary.total }}</strong>
            </div>
          </div>
          <button class="start-btn" @click="backHome">回到首页继续学习</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { ocrAPI, studyAPI, textbookAPI } from '../utils/api'

// ── Types ──────────────────────────────────────────────────────────────
interface Word {
  word: string
  phonetic: string
  meaning: string
}

interface VocabularySource {
  sourceType: SourceType
  sourceId: string
  sourceTitle: string
  textbookId?: number | null
  unitName?: string | null
}

interface LastVocabularySelection {
  sourceType: SourceType
  materialId?: number | null
  textbookId?: number | null
  unitName?: string
}

interface VocabularyProgressWord {
  word: string
  wordKey: string
  status: 'new' | 'learning' | 'reviewing' | 'mastered'
  masteryScore: number
  streakCorrect: number
  studyCount: number
  correctCount: number
  wrongCount: number
  nextReviewAt?: string | null
  reviewIntervalDays: number
  difficult: boolean
}

type StudyMode = 'sequential' | 'random'
type SourceType = 'material' | 'textbook'

interface MaterialRecord {
  id: number
  name?: string
  createTime?: string
  words?: any[]
}

interface Textbook {
  id: number
  bookName: string
  publisher?: string
  [key: string]: any
}

interface Unit {
  unitName: string
  wordCount: number
}

interface QuizQuestion {
  word: string
  phonetic: string
  answer: string
  options: string[]
}

type ViewName = 'home' | 'study' | 'quiz' | 'summary'

interface SummaryState {
  score: number
  total: number
  accuracy: number
  learnedThisRound: number
}

// ── Helpers ────────────────────────────────────────────────────────────
function normalizeWord(raw: any): Word | null {
  const word = String(raw?.word || raw?.english || '').trim()
  if (!word) return null

  return {
    word,
    phonetic: raw?.phonetic || '',
    meaning: raw?.meaning || raw?.chinese || '暂无释义',
  }
}

function normalizeWords(words: any[]): Word[] {
  return words
    .map(normalizeWord)
    .filter((word): word is Word => Boolean(word))
}

function getWordKey(word: string) {
  return word.trim().toLowerCase()
}

function shuffle<T>(input: T[]): T[] {
  const output = [...input]
  for (let i = output.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[output[i], output[j]] = [output[j], output[i]]
  }
  return output
}

function getSessionWords(words: Word[], mode: StudyMode, size = 8): Word[] {
  return mode === 'random' ? shuffle(words).slice(0, size) : words.slice(0, size)
}

function getPlannedSessionWords(words: Word[], progress: VocabularyProgressWord[], mode: StudyMode, size = 8): Word[] {
  const progressByKey = new Map(progress.map((item) => [item.wordKey, item]))
  const now = Date.now()
  const scored = words.map((word, index) => {
    const item = progressByKey.get(getWordKey(word.word))
    const nextReviewTime = item?.nextReviewAt ? new Date(item.nextReviewAt).getTime() : 0
    const due = item?.nextReviewAt ? nextReviewTime <= now : false
    const priority =
      item?.status === 'mastered'
        ? 5
        : due
          ? 0
          : item?.difficult
            ? 1
            : item && item.masteryScore < 60 && item.status !== 'new'
              ? 2
              : item?.status === 'new' || !item
                ? 3
                : 4

    return {
      word,
      priority,
      score: item?.masteryScore ?? 0,
      index,
      random: Math.random(),
    }
  })

  scored.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority
    if (mode === 'random') return a.random - b.random
    if (a.score !== b.score) return a.score - b.score
    return a.index - b.index
  })

  return scored.slice(0, size).map((item) => item.word)
}

function createQuizQuestions(sessionWords: Word[], pool: Word[], size = sessionWords.length): QuizQuestion[] {
  const selected = shuffle(sessionWords).slice(0, Math.min(size, sessionWords.length))
  return selected.map((word) => {
    const distractors = shuffle(
      pool.filter((item) => item.word !== word.word).map((item) => item.meaning),
    )
      .filter((m, i, arr) => arr.indexOf(m) === i)
      .slice(0, 3)
    return {
      word: word.word,
      phonetic: word.phonetic,
      answer: word.meaning,
      options: shuffle([word.meaning, ...distractors]),
    }
  })
}

// ── State ──────────────────────────────────────────────────────────────
const router = useRouter()
const LAST_SELECTION_KEY = 'vocabulary-last-selection'

const currentView = ref<ViewName>('home')
const studyMode = ref<StudyMode>('sequential')
const sourceType = ref<SourceType>('material')
const currentSource = ref<VocabularySource | null>(null)
const wordBank = ref<Word[]>([])
const progressWords = ref<VocabularyProgressWord[]>([])
const selectedSourceTitle = ref('请选择词库')
const materialRecords = ref<MaterialRecord[]>([])
const materialLoading = ref(false)
const selectedMaterialId = ref<number | null>(null)
const textbooks = ref<Textbook[]>([])
const textbookUnits = ref<Unit[]>([])
const textbookLoading = ref(false)
const unitLoading = ref(false)
const progressSaving = ref(false)
const minSessionWordCount = 8
const sessionWordCount = ref(minSessionWordCount)
const selectedTextbookId = ref<number | null>(null)
const selectedUnitName = ref('')
const sessionWords = ref<Word[]>([])
const currentIndex = ref(0)
const showMeaning = ref(false)
const quizQuestions = ref<QuizQuestion[]>([])
const quizIndex = ref(0)
const selectedAnswer = ref<string | null>(null)
const correctCount = ref(0)
const sessionLearnedWords = ref<string[]>([])

const currentWord = computed(() => sessionWords.value[currentIndex.value])
const currentQuestion = computed(() => quizQuestions.value[quizIndex.value])
const sourceLoading = computed(() => materialLoading.value || textbookLoading.value || unitLoading.value)
const maxSessionWordCount = computed(() => Math.max(minSessionWordCount, wordBank.value.length))
const startButtonText = computed(() => {
  if (wordBank.value.length === 0) return '请选择词库'
  if (wordBank.value.length < minSessionWordCount) return `至少需要 ${minSessionWordCount} 个单词`
  return '开始本轮学习'
})

const learningStats = computed(() => {
  const total = wordBank.value.length
  const progressByKey = new Map(progressWords.value.map((word) => [word.wordKey, word]))
  const activeWords = wordBank.value.map((word) => progressByKey.get(getWordKey(word.word)))
  const mastered = activeWords.filter((word) => word?.status === 'mastered').length
  const learning = activeWords.filter((word) => word?.status === 'learning').length
  const reviewing = activeWords.filter((word) => word?.status === 'reviewing').length
  const totalScore = activeWords.reduce((sum, word) => sum + Number(word?.masteryScore || 0), 0)
  const progress = total === 0 ? 0 : Math.round(totalScore / total)
  return { mastered, learning, reviewing, total, progress }
})

const summary = computed<SummaryState>(() => {
  const total = quizQuestions.value.length
  const accuracy = total === 0 ? 0 : Math.round((correctCount.value / total) * 100)
  return {
    score: correctCount.value,
    total,
    accuracy,
    learnedThisRound: sessionLearnedWords.value.length,
  }
})

// ── Actions ────────────────────────────────────────────────────────────
const goBack = () => router.back()

function loadLastSelection(): LastVocabularySelection | null {
  try {
    const raw = localStorage.getItem(LAST_SELECTION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!['material', 'textbook'].includes(parsed?.sourceType)) return null
    return parsed
  } catch {
    return null
  }
}

function saveLastSelection(selection: LastVocabularySelection) {
  localStorage.setItem(LAST_SELECTION_KEY, JSON.stringify(selection))
}

function resetLearningFlow() {
  sessionWords.value = []
  currentIndex.value = 0
  showMeaning.value = false
  quizQuestions.value = []
  quizIndex.value = 0
  selectedAnswer.value = null
  correctCount.value = 0
  sessionLearnedWords.value = []
  currentView.value = 'home'
}

function getEffectiveSessionWordCount() {
  return Math.min(sessionWordCount.value, wordBank.value.length)
}

function refreshSessionWordsPreview() {
  sessionWords.value = getPlannedSessionWords(wordBank.value, progressWords.value, studyMode.value, getEffectiveSessionWordCount())
}

async function setWordBank(words: Word[], source: VocabularySource) {
  wordBank.value = words
  progressWords.value = []
  currentSource.value = source
  selectedSourceTitle.value = source.sourceTitle
  resetLearningFlow()
  sessionWordCount.value = Math.min(Math.max(sessionWordCount.value, minSessionWordCount), maxSessionWordCount.value)
  refreshSessionWordsPreview()

  try {
    const response = await studyAPI.upsertVocabularySource({
      ...source,
      words
    })
    applyVocabularyProgress(response.data.data)
  } catch (error) {
    console.error('同步背单词词库失败:', error)
    message.error('请登录后使用背单词')
    wordBank.value = []
    progressWords.value = []
    currentSource.value = null
    selectedSourceTitle.value = '请选择词库'
    resetLearningFlow()
  }
}

function applyVocabularyProgress(data: any) {
  const words = Array.isArray(data?.words) ? data.words : []
  progressWords.value = words.map((word: any) => ({
    word: word.word,
    wordKey: word.wordKey || getWordKey(word.word || ''),
    status: word.status || 'new',
    masteryScore: Number(word.masteryScore || 0),
    streakCorrect: Number(word.streakCorrect || 0),
    studyCount: Number(word.studyCount || 0),
    correctCount: Number(word.correctCount || 0),
    wrongCount: Number(word.wrongCount || 0),
    nextReviewAt: word.nextReviewAt || null,
    reviewIntervalDays: Number(word.reviewIntervalDays || 0),
    difficult: Boolean(word.difficult),
  }))
  refreshSessionWordsPreview()
}

async function updateWordProgress(word: Word, status: 'learning' | 'reviewing' | 'mastered', isCorrect?: boolean) {
  if (!currentSource.value) {
    message.error('请先选择词库')
    throw new Error('missing vocabulary source')
  }

  progressSaving.value = true
  try {
    const response = await studyAPI.updateVocabularyProgress({
      sourceType: currentSource.value.sourceType,
      sourceId: currentSource.value.sourceId,
      words: [
        {
          ...word,
          status,
          isCorrect,
        },
      ],
    })
    applyVocabularyProgress(response.data.data)
  } catch (error) {
    console.error('更新背单词进度失败:', error)
    message.error('学习进度保存失败')
    throw error
  } finally {
    progressSaving.value = false
  }
}

async function loadMaterialRecords() {
  materialLoading.value = true
  try {
    const response = await ocrAPI.getOCRTasks()
    if (!response.data.success || !response.data.data) {
      materialRecords.value = []
      return
    }

    const records = await Promise.all(
      response.data.data.map(async (task: MaterialRecord) => {
        try {
          const wordsResponse = await ocrAPI.getOCRTaskWords(task.id)
          return {
            ...task,
            words: wordsResponse.data.success ? wordsResponse.data.data?.words || [] : [],
          }
        } catch (error) {
          console.error(`获取听写库${task.id}单词失败:`, error)
          return { ...task, words: [] }
        }
      }),
    )

    materialRecords.value = records
  } catch (error) {
    console.error('加载听写库失败:', error)
    materialRecords.value = []
  } finally {
    materialLoading.value = false
  }
}

async function loadTextbooks() {
  textbookLoading.value = true
  try {
    const response = await textbookAPI.getTextbooks()
    textbooks.value = response.data.success && response.data.data
      ? response.data.data.sort((a: Textbook, b: Textbook) => a.id - b.id)
      : []
  } catch (error) {
    console.error('加载教材失败:', error)
    textbooks.value = []
  } finally {
    textbookLoading.value = false
  }
}

async function selectMaterialRecord(record: MaterialRecord) {
  selectedMaterialId.value = record.id
  selectedTextbookId.value = null
  selectedUnitName.value = ''
  textbookUnits.value = []
  const title = record.name || '未命名素材'
  await setWordBank(normalizeWords(record.words || []), {
    sourceType: 'material',
    sourceId: `ocr:${record.id}`,
    sourceTitle: title,
  })
  saveLastSelection({
    sourceType: 'material',
    materialId: record.id,
  })
}

async function handleTextbookChange(value: number) {
  const id = Number(value)
  if (!id) return

  selectedTextbookId.value = id
  selectedUnitName.value = ''
  textbookUnits.value = []
  wordBank.value = []
  progressWords.value = []
  currentSource.value = null
  selectedSourceTitle.value = '请选择教材单元'
  resetLearningFlow()
  await loadTextbookUnits(id)
}

async function loadTextbookUnits(textbookId: number) {
  unitLoading.value = true
  try {
    const response = await textbookAPI.getTextbookUnits(textbookId)
    textbookUnits.value = response.data.success && response.data.data ? response.data.data : []
  } catch (error) {
    console.error('加载教材单元失败:', error)
    textbookUnits.value = []
  } finally {
    unitLoading.value = false
  }
}

async function selectTextbookUnit(unit: Unit) {
  if (!selectedTextbookId.value) return

  selectedUnitName.value = unit.unitName
  unitLoading.value = true
  try {
    const response = await textbookAPI.getUnitWords(selectedTextbookId.value, unit.unitName)
    const words = response.data.success && response.data.data ? normalizeWords(response.data.data) : []
    const textbook = textbooks.value.find((item) => item.id === selectedTextbookId.value)
    await setWordBank(words, {
      sourceType: 'textbook',
      sourceId: `textbook:${selectedTextbookId.value}:unit:${unit.unitName}`,
      sourceTitle: `${textbook?.bookName || '教材'} - ${unit.unitName}`,
      textbookId: selectedTextbookId.value,
      unitName: unit.unitName,
    })
    saveLastSelection({
      sourceType: 'textbook',
      textbookId: selectedTextbookId.value,
      unitName: unit.unitName,
    })
  } catch (error) {
    console.error('加载教材单词失败:', error)
    message.error('加载教材单词失败')
    wordBank.value = []
    progressWords.value = []
    currentSource.value = null
    selectedSourceTitle.value = '请选择教材单元'
    resetLearningFlow()
  } finally {
    unitLoading.value = false
  }
}

function switchSource(type: SourceType) {
  sourceType.value = type
  resetLearningFlow()
  if (type === 'material') {
    if (materialRecords.value.length === 0) {
      loadMaterialRecords()
    }
    const selected = materialRecords.value.find((record) => record.id === selectedMaterialId.value)
    if (selected) selectMaterialRecord(selected)
    return
  }

  if (textbooks.value.length === 0) {
    loadTextbooks()
  }
  wordBank.value = []
  progressWords.value = []
  currentSource.value = null
  selectedSourceTitle.value = selectedTextbookId.value ? '请选择教材单元' : '请选择教材'
}

function setStudyMode(mode: StudyMode) {
  studyMode.value = mode
  refreshSessionWordsPreview()
}

function adjustSessionWordCount(delta: number) {
  sessionWordCount.value = Math.min(Math.max(sessionWordCount.value + delta, minSessionWordCount), maxSessionWordCount.value)
  refreshSessionWordsPreview()
}

function startSession() {
  if (wordBank.value.length === 0) {
    message.warning('请先选择词库')
    return
  }
  if (wordBank.value.length < minSessionWordCount) {
    message.warning(`当前词库至少需要 ${minSessionWordCount} 个单词`)
    return
  }

  refreshSessionWordsPreview()
  currentIndex.value = 0
  showMeaning.value = false
  quizQuestions.value = []
  quizIndex.value = 0
  selectedAnswer.value = null
  correctCount.value = 0
  sessionLearnedWords.value = []
  currentView.value = 'study'
}

async function markCurrentWordLearned() {
  const word = currentWord.value
  if (!word) return
  if (!sessionLearnedWords.value.includes(word.word)) {
    sessionLearnedWords.value = [...sessionLearnedWords.value, word.word]
  }
  await updateWordProgress(word, 'learning')
}

function goPrev() {
  if (currentIndex.value === 0) return
  currentIndex.value -= 1
  showMeaning.value = false
}

async function goNext() {
  try {
    await markCurrentWordLearned()
  } catch {
    return
  }
  if (currentIndex.value >= sessionWords.value.length - 1) {
    finishStudy()
    return
  }
  currentIndex.value += 1
  showMeaning.value = false
}

function finishStudy() {
  quizQuestions.value = createQuizQuestions(sessionWords.value, wordBank.value)
  quizIndex.value = 0
  selectedAnswer.value = null
  correctCount.value = 0
  currentView.value = 'quiz'
}

async function submitQuizAnswer() {
  if (!selectedAnswer.value || !currentQuestion.value) return
  const isCorrect = selectedAnswer.value === currentQuestion.value.answer
  const word = wordBank.value.find((item) => item.word === currentQuestion.value?.word) || {
    word: currentQuestion.value.word,
    phonetic: currentQuestion.value.phonetic,
    meaning: currentQuestion.value.answer,
  }
  try {
  await updateWordProgress(word, isCorrect ? 'reviewing' : 'learning', isCorrect)
  } catch {
    return
  }
  if (isCorrect) {
    correctCount.value += 1
  }
  if (quizIndex.value >= quizQuestions.value.length - 1) {
    currentView.value = 'summary'
    return
  }
  quizIndex.value += 1
  selectedAnswer.value = null
}

function backHome() {
  currentView.value = 'home'
  showMeaning.value = false
  selectedAnswer.value = null
}

async function restoreLastSelection() {
  const selection = loadLastSelection()
  if (!selection) {
    return
  }

  sourceType.value = selection.sourceType
  if (selection.sourceType === 'material' && selection.materialId) {
    const record = materialRecords.value.find((item) => item.id === selection.materialId)
    if (record) {
      await selectMaterialRecord(record)
    }
    return
  }

  if (selection.sourceType === 'textbook' && selection.textbookId && selection.unitName) {
    selectedTextbookId.value = selection.textbookId
    await loadTextbookUnits(selection.textbookId)
    const unit = textbookUnits.value.find((item) => item.unitName === selection.unitName)
    if (unit) {
      await selectTextbookUnit(unit)
    }
  }
}

onMounted(async () => {
  await Promise.all([loadMaterialRecords(), loadTextbooks()])
  await restoreLastSelection()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

/* ── Page shell ── */
.vocabulary-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(176deg, #eeefff 2.1%, #fff 45.26%);
  position: relative;
  overflow: hidden;
}

.blur-circle {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  filter: blur(80px);
  opacity: 0.45;
}

.blur-circle-1 {
  width: 260px;
  height: 260px;
  background: rgba(123, 104, 255, 0.12);
  top: -60px;
  right: -60px;
}

.blur-circle-2 {
  width: 200px;
  height: 200px;
  background: rgba(51, 112, 255, 0.08);
  bottom: 80px;
  left: -60px;
}

.main-content {
  flex: 1;
  padding: 24px;
  position: relative;
  z-index: 1;
  padding-bottom: 40px;
}

/* ── Page header ── */
.page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  box-shadow: 0 2px 8px rgba(123, 104, 255, 0.1);
  color: #475569;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.25s ease;
}

.back-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(123, 104, 255, 0.2);
}

.header-text {
  flex: 1;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 2px 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

.header-spacer {
  width: 40px;
}

/* ── Section title (matches HomePage) ── */
.section-title {
  font-size: 18px;
  margin: 16px 0;
  padding-top: 10px;
  color: #1e293b;
  font-weight: 500;
}

/* ── Source selection ── */
.source-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.08);
}

.source-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 4px;
  border-radius: 14px;
  background: rgba(123, 104, 255, 0.08);
}

.source-tab {
  height: 40px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #64748b;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.source-tab-active {
  background: #fff;
  color: #7b68ff;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.12);
}

.source-panel {
  margin-top: 14px;
}

.source-list {
  display: grid;
  gap: 8px;
  max-height: 220px;
  overflow-y: auto;
}

.source-item {
  width: 100%;
  min-height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.12);
  background: rgba(255, 255, 255, 0.9);
  color: #334155;
  text-align: left;
  cursor: pointer;
}

.source-item-active {
  border-color: rgba(123, 104, 255, 0.35);
  background: linear-gradient(135deg, rgba(123, 104, 255, 0.12) 0%, rgba(51, 112, 255, 0.06) 100%);
}

.source-name {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.source-meta {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
}

.source-state {
  min-height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(248, 250, 252, 0.86);
  color: #94a3b8;
  font-size: 14px;
}

.source-select {
  width: 100%;
  height: 44px;
  margin-bottom: 10px;
}

.source-select :deep(.ant-select-selector) {
  height: 44px !important;
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.16) !important;
  background: rgba(255, 255, 255, 0.92) !important;
  box-shadow: none !important;
}

.source-select :deep(.ant-select-selection-item),
.source-select :deep(.ant-select-selection-placeholder) {
  line-height: 44px !important;
  font-size: 14px;
  font-weight: 600;
}

.source-select :deep(.ant-select-selection-item) {
  color: #1e293b;
}

.source-select :deep(.ant-select-selection-placeholder) {
  color: #94a3b8;
}

.source-select :deep(.ant-select-arrow) {
  color: #94a3b8;
}

.source-select :deep(.ant-select-focused .ant-select-selector),
.source-select.ant-select-focused :deep(.ant-select-selector) {
  border-color: rgba(123, 104, 255, 0.45) !important;
}

/* keep leftover select-like typography from changing generated Ant markup */
.source-select {
  font-size: 14px;
  font-weight: 600;
}

.source-current {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
}

.source-current-label {
  flex-shrink: 0;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
}

.source-current strong {
  min-width: 0;
  color: #1e293b;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── Stats grid ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 14px 10px;
  text-align: center;
  border: 1px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.08);
}

.stat-card.accent-card {
  background: linear-gradient(135deg, rgba(123, 104, 255, 0.12) 0%, rgba(51, 112, 255, 0.08) 100%);
  border-color: rgba(123, 104, 255, 0.2);
}

.stat-label {
  display: block;
  font-size: 11px;
  color: #94a3b8;
  margin-bottom: 6px;
}

.stat-num {
  display: block;
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

/* ── Progress card ── */
.progress-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 16px 18px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.08);
  margin-bottom: 4px;
}

.progress-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.progress-label {
  font-size: 14px;
  color: #64748b;
}

.progress-pct {
  font-size: 14px;
  font-weight: 700;
  color: #7b68ff;
}

.progress-track {
  height: 8px;
  border-radius: 999px;
  background: rgba(123, 104, 255, 0.1);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, rgba(123, 104, 255, 0.9) 0%, rgba(51, 112, 255, 0.9) 100%);
  transition: width 0.4s ease;
}

/* ── Mode selection ── */
.mode-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 24px;
}

.mode-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 16px 18px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.08);
  cursor: pointer;
  transition: all 0.25s ease;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
}

.mode-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(102, 126, 234, 0.15);
}

.mode-item.mode-active {
  background: linear-gradient(135deg, rgba(123, 104, 255, 0.12) 0%, rgba(51, 112, 255, 0.08) 100%);
  border-color: rgba(123, 104, 255, 0.3);
  color: #7b68ff;
}

/* ── Session size ── */
.count-card {
  display: grid;
  grid-template-columns: 52px 1fr 52px;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 12px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.08);
}

.count-btn {
  width: 52px;
  height: 44px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(123, 104, 255, 0.12) 0%, rgba(51, 112, 255, 0.08) 100%);
  color: #7b68ff;
  font-size: 24px;
  font-weight: 700;
  cursor: pointer;
}

.count-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.count-display {
  min-width: 0;
  text-align: center;
}

.count-display strong {
  display: block;
  font-size: 24px;
  line-height: 1;
  color: #1e293b;
}

.count-display span {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
}

/* ── Primary start button ── */
.start-btn {
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 80px;
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(90deg, rgba(123, 104, 255, 0.9) 0%, rgba(51, 112, 255, 0.9) 100%);
  color: #fff;
  box-shadow: 0 6px 20px rgba(123, 104, 255, 0.35);
  cursor: pointer;
  transition: all 0.25s ease;
  margin-top: 4px;
}

.start-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(123, 104, 255, 0.45);
}

.start-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* ── Study card ── */
.study-card,
.quiz-card,
.summary-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.08);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.study-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.study-tag {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7b68ff;
  background: rgba(123, 104, 255, 0.1);
  border-radius: 80px;
  padding: 4px 12px;
}

.study-counter {
  font-size: 13px;
  font-weight: 700;
  color: #94a3b8;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 80px;
  padding: 4px 12px;
}

.word-display {
  text-align: center;
  padding: 16px 0;
}

.word-text {
  font-size: clamp(2rem, 8vw, 2.8rem);
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 10px 0;
  letter-spacing: -0.02em;
}

.word-phonetic {
  font-size: 16px;
  color: #94a3b8;
  margin: 0;
}

.meaning-area {
  background: linear-gradient(135deg, rgba(123, 104, 255, 0.06) 0%, rgba(51, 112, 255, 0.04) 100%);
  border-radius: 14px;
  padding: 16px;
  border: 1px solid rgba(123, 104, 255, 0.12);
}

.word-meaning {
  font-size: 16px;
  color: #334155;
  margin: 0;
  line-height: 1.6;
  text-align: center;
}

.study-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.action-btn {
  height: 46px;
  border: none;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.ghost-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #334155;
  border: 1px solid rgba(102, 126, 234, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.ghost-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.primary-btn {
  background: linear-gradient(90deg, rgba(123, 104, 255, 0.9) 0%, rgba(51, 112, 255, 0.9) 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(123, 104, 255, 0.3);
}

/* ── Quiz card ── */
.quiz-prompt-label {
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

.quiz-word-block {
  background: linear-gradient(135deg, rgba(123, 104, 255, 0.08) 0%, rgba(51, 112, 255, 0.05) 100%);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  border: 1px solid rgba(123, 104, 255, 0.12);
}

.options-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.option-btn {
  padding: 14px 12px;
  border: 1px solid rgba(102, 126, 234, 0.15);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.9);
  color: #334155;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1.4;
}

.option-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.12);
}

.option-btn.option-selected {
  background: linear-gradient(135deg, rgba(123, 104, 255, 0.12) 0%, rgba(51, 112, 255, 0.08) 100%);
  border-color: rgba(123, 104, 255, 0.35);
  color: #7b68ff;
  font-weight: 700;
}

/* ── Summary card ── */
.summary-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  text-align: center;
}

.score-ring {
  width: 160px;
  height: 160px;
  margin: 0 auto;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(123, 104, 255, 0.12) 0%, rgba(51, 112, 255, 0.08) 100%);
  border: 2px solid rgba(123, 104, 255, 0.2);
}

.score-num {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  display: block;
  line-height: 1;
}

.score-label {
  font-size: 13px;
  color: #94a3b8;
  display: block;
  margin-top: 6px;
}

.summary-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.summary-stat-item {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 14px;
  padding: 16px;
  text-align: center;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.summary-stat-item span {
  display: block;
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 6px;
}

.summary-stat-item strong {
  display: block;
  font-size: 1.6rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .main-content {
    padding: 16px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .study-actions {
    grid-template-columns: 1fr;
  }
}
</style>
