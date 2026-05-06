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
        <!-- Stats cards -->
        <h2 class="section-title">学习进度</h2>
        <div class="stats-grid">
          <div class="stat-card accent-card">
            <span class="stat-label">已掌握</span>
            <strong class="stat-num">{{ learningStats.learned }}</strong>
          </div>
          <div class="stat-card">
            <span class="stat-label">总词数</span>
            <strong class="stat-num">{{ learningStats.total }}</strong>
          </div>
          <div class="stat-card">
            <span class="stat-label">剩余</span>
            <strong class="stat-num">{{ learningStats.remaining }}</strong>
          </div>
          <div class="stat-card">
            <span class="stat-label">本轮</span>
            <strong class="stat-num">{{ sessionWords.length }}</strong>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="progress-card">
          <div class="progress-row">
            <span class="progress-label">累计进度</span>
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
            @click="studyMode = 'sequential'"
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
            @click="studyMode = 'random'"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" />
            </svg>
            <span>随机抽取</span>
          </div>
        </div>

        <!-- Start button -->
        <button class="start-btn" @click="startSession">开始本轮学习</button>
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
            <button class="action-btn ghost-btn" @click="showMeaning = !showMeaning">
              {{ showMeaning ? '隐藏释义' : '查看释义' }}
            </button>
            <button class="action-btn ghost-btn" :disabled="currentIndex === 0" @click="goPrev">上一个</button>
            <button class="action-btn primary-btn" @click="goNext">下一个</button>
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
          <button class="start-btn" :disabled="!selectedAnswer" @click="submitQuizAnswer">
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

// ── Types ──────────────────────────────────────────────────────────────
interface Word {
  word: string
  phonetic: string
  meaning: string
}

type StudyMode = 'sequential' | 'random'

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

// ── Word bank ──────────────────────────────────────────────────────────
const wordBank: Word[] = [
  { word: 'ability', phonetic: '/əˈbɪləti/', meaning: 'n. 能力' },
  { word: 'active', phonetic: '/ˈæktɪv/', meaning: 'adj. 积极的；活跃的' },
  { word: 'ancient', phonetic: '/ˈeɪnʃənt/', meaning: 'adj. 古代的；古老的' },
  { word: 'arrive', phonetic: '/əˈraɪv/', meaning: 'v. 到达' },
  { word: 'borrow', phonetic: '/ˈbɒrəʊ/', meaning: 'v. 借入' },
  { word: 'bright', phonetic: '/braɪt/', meaning: 'adj. 明亮的；聪明的' },
  { word: 'careful', phonetic: '/ˈkeəfəl/', meaning: 'adj. 认真的；小心的' },
  { word: 'culture', phonetic: '/ˈkʌltʃə(r)/', meaning: 'n. 文化' },
  { word: 'decide', phonetic: '/dɪˈsaɪd/', meaning: 'v. 决定' },
  { word: 'develop', phonetic: '/dɪˈveləp/', meaning: 'v. 发展；培养' },
  { word: 'encourage', phonetic: '/ɪnˈkʌrɪdʒ/', meaning: 'v. 鼓励' },
  { word: 'famous', phonetic: '/ˈfeɪməs/', meaning: 'adj. 著名的' },
  { word: 'future', phonetic: '/ˈfjuːtʃə(r)/', meaning: 'n. 未来' },
  { word: 'improve', phonetic: '/ɪmˈpruːv/', meaning: 'v. 改进；提高' },
  { word: 'journey', phonetic: '/ˈdʒɜːni/', meaning: 'n. 旅行；旅程' },
  { word: 'knowledge', phonetic: '/ˈnɒlɪdʒ/', meaning: 'n. 知识' },
  { word: 'manage', phonetic: '/ˈmænɪdʒ/', meaning: 'v. 设法做到；管理' },
  { word: 'patient', phonetic: '/ˈpeɪʃənt/', meaning: 'adj. 耐心的' },
  { word: 'prepare', phonetic: '/prɪˈpeə(r)/', meaning: 'v. 准备' },
  { word: 'protect', phonetic: '/prəˈtekt/', meaning: 'v. 保护' },
  { word: 'review', phonetic: '/rɪˈvjuː/', meaning: 'v. 复习；回顾' },
  { word: 'share', phonetic: '/ʃeə(r)/', meaning: 'v. 分享' },
  { word: 'success', phonetic: '/səkˈses/', meaning: 'n. 成功' },
  { word: 'wonder', phonetic: '/ˈwʌndə(r)/', meaning: 'v. 想知道；惊叹' },
]

// ── Helpers ────────────────────────────────────────────────────────────
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

function createQuizQuestions(sessionWords: Word[], pool: Word[], size = 5): QuizQuestion[] {
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

// ── Storage ────────────────────────────────────────────────────────────
const STORAGE_KEY = 'word-recite-learned-words'

function loadLearnedWords(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveLearnedWords(words: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words))
}

// ── State ──────────────────────────────────────────────────────────────
const router = useRouter()

const currentView = ref<ViewName>('home')
const studyMode = ref<StudyMode>('sequential')
const sessionWords = ref<Word[]>(getSessionWords(wordBank, 'sequential'))
const currentIndex = ref(0)
const showMeaning = ref(false)
const quizQuestions = ref<QuizQuestion[]>([])
const quizIndex = ref(0)
const selectedAnswer = ref<string | null>(null)
const learnedWords = ref<string[]>(loadLearnedWords())
const correctCount = ref(0)
const sessionLearnedWords = ref<string[]>([])

const currentWord = computed(() => sessionWords.value[currentIndex.value])
const currentQuestion = computed(() => quizQuestions.value[quizIndex.value])

const learningStats = computed(() => {
  const learned = learnedWords.value.length
  const total = wordBank.length
  const remaining = Math.max(total - learned, 0)
  const progress = total === 0 ? 0 : Math.round((learned / total) * 100)
  return { learned, total, remaining, progress }
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

function startSession() {
  sessionWords.value = getSessionWords(wordBank, studyMode.value)
  currentIndex.value = 0
  showMeaning.value = false
  quizQuestions.value = []
  quizIndex.value = 0
  selectedAnswer.value = null
  correctCount.value = 0
  sessionLearnedWords.value = []
  currentView.value = 'study'
}

function markCurrentWordLearned() {
  const word = currentWord.value?.word
  if (!word) return
  if (!sessionLearnedWords.value.includes(word)) {
    sessionLearnedWords.value = [...sessionLearnedWords.value, word]
  }
  if (!learnedWords.value.includes(word)) {
    learnedWords.value = [...learnedWords.value, word]
    saveLearnedWords(learnedWords.value)
  }
}

function goPrev() {
  if (currentIndex.value === 0) return
  currentIndex.value -= 1
  showMeaning.value = false
}

function goNext() {
  markCurrentWordLearned()
  if (currentIndex.value >= sessionWords.value.length - 1) {
    finishStudy()
    return
  }
  currentIndex.value += 1
  showMeaning.value = false
}

function finishStudy() {
  markCurrentWordLearned()
  quizQuestions.value = createQuizQuestions(sessionWords.value, wordBank)
  quizIndex.value = 0
  selectedAnswer.value = null
  correctCount.value = 0
  currentView.value = 'quiz'
}

function submitQuizAnswer() {
  if (!selectedAnswer.value || !currentQuestion.value) return
  if (selectedAnswer.value === currentQuestion.value.answer) {
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
