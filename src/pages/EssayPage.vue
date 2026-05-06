<template>
    <div class="essay-page">
        <div class="main-content">
            <!-- 页面头部 -->
            <div class="page-header">
                <button class="back-btn" @click="goBack">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
                <div class="header-text">
                    <h1 class="page-title">AI 写作文</h1>
                    <p class="page-subtitle">智能生成，轻松创作</p>
                </div>
            </div>

            <!-- 作文类型 -->
            <div class="section-title">作文类型</div>
            <div class="card">
                <div class="tag-group">
                    <button
                        v-for="type in essayTypes"
                        :key="type.value"
                        class="tag-btn"
                        :class="{ active: essayType === type.value }"
                        @click="essayType = type.value"
                    >{{ type.label }}</button>
                </div>
            </div>

            <!-- 词数要求 -->
            <div class="section-title">词数要求</div>
            <div class="card">
                <div class="tag-group">
                    <button
                        v-for="wc in wordCounts"
                        :key="wc.value"
                        class="tag-btn"
                        :class="{ active: wordCount === wc.value }"
                        @click="wordCount = wc.value"
                    >{{ wc.label }}</button>
                </div>
            </div>

            <!-- 作文主题 -->
            <div class="section-title">作文主题</div>
            <div class="card">
                <div class="input-wrap">
                    <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    <a-input
                        v-model:value="essayTopic"
                        placeholder="请输入作文主题，例如：My Favourite Season"
                        :bordered="false"
                        class="bare-input"
                    />
                </div>
            </div>

            <!-- 作文要求 -->
            <div class="section-title">补充要求 <span class="optional">（选填）</span></div>
            <div class="card textarea-card">
                <a-textarea
                    v-model:value="essayRequirements"
                    placeholder="可补充具体要求，如：需要使用5个以上形容词，语言生动..."
                    :rows="3"
                    :bordered="false"
                    class="bare-textarea"
                />
            </div>

            <!-- 生成按钮 -->
            <button class="generate-btn" :disabled="loading" @click="generateEssay">
                <svg v-if="!loading" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span v-if="!loading">生成作文</span>
                <span v-else class="loading-dots">
                    <span></span><span></span><span></span>
                </span>
            </button>

            <!-- 生成结果 -->
            <div v-if="essayResult" class="result-section">
                <div class="section-title" style="margin-top: 0">
                    生成结果
                    <button class="copy-btn" @click="copyEssay">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        复制
                    </button>
                </div>
                <div class="card result-card">
                    <h4 class="result-title">{{ essayTopic || '未命名作文' }}</h4>
                    <div class="result-divider"></div>
                    <p class="result-body">{{ essayResult }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const router = useRouter()

const essayTypes = [
    { value: 'narrative', label: '记叙文' },
    { value: 'argumentative', label: '议论文' },
    { value: 'expository', label: '说明文' },
    { value: 'descriptive', label: '描述文' },
    { value: 'letter', label: '书信' },
    { value: 'speech', label: '演讲稿' }
]

const wordCounts = [
    { value: '100', label: '100词' },
    { value: '120', label: '120词' },
    { value: '150', label: '150词' },
    { value: '200', label: '200词' }
]

const essayType = ref('narrative')
const wordCount = ref('120')
const essayTopic = ref('')
const essayRequirements = ref('')
const essayResult = ref('')
const loading = ref(false)

const goBack = () => {
    router.back()
}

const generateEssay = async () => {
    if (!essayTopic.value.trim()) {
        message.error('请输入作文主题')
        return
    }

    loading.value = true

    try {
        await new Promise(resolve => setTimeout(resolve, 2000))

        const mockEssays: Record<string, string> = {
            argumentative: `Nowadays, with the rapid development of technology, people's lifestyles have undergone tremendous changes. However, while enjoying the convenience brought by technology, we should also think about its impact on human society.\n\nSome people believe that the development of technology has greatly improved people's quality of life. For example, the popularity of the Internet allows us to access information anytime and anywhere, and the development of artificial intelligence makes our work more efficient.\n\nHowever, others argue that the development of technology has brought some negative effects. Over-reliance on technology may lead to a decline in human creativity and thinking ability.\n\nIn my opinion, technology itself is neutral. We should use technology rationally so that it becomes our powerful assistant, helping us create a better life.`,
            narrative: `On a sunny morning, I embarked on a wonderful journey. The sky was as blue as a sapphire, with a few white clouds floating leisurely.\n\nI walked along a winding path, with lush trees on both sides. Birds were singing happily on the branches, and butterflies were dancing among the flowers. Suddenly, I discovered a meadow full of wildflowers.\n\nJust as I was enjoying this beautiful scenery, a little rabbit darted out from the grass. It hopped closer to me, as if inviting me to play with it.\n\nIt was truly an unforgettable journey. It made me feel the beauty of nature and the magic of life.`,
            expository: `Artificial Intelligence (AI) refers to computer systems that can simulate human intelligent behaviors, such as learning, reasoning, and problem-solving.\n\nAI has a wide range of applications, including healthcare, education, finance, and transportation. In the healthcare field, AI can help doctors diagnose diseases; in education, AI can provide personalized learning plans for students.\n\nThe development of AI also faces some challenges, such as data privacy and algorithmic bias. We need to formulate relevant laws and regulations to ensure the development of AI is in the interest of humanity.\n\nIn conclusion, AI is a powerful technology whose development will have a profound impact on human society.`,
            descriptive: `The park in autumn is a beautiful painting. As soon as you enter the park gate, you can smell a faint fragrance of osmanthus.\n\nIn the center of the park is a small lake. The water is crystal clear, and the lake surface is like a mirror, reflecting the blue sky and white clouds. The willow trees by the lake have started to shed their leaves. Golden leaves dance in the air like butterflies.\n\nChrysanthemums in the park are in full bloom, with various colors—red, yellow, white, purple—all very beautiful. They sway in the breeze, showing their beauty to the world.\n\nThe park in autumn is a poetic place, making people feel the beauty of nature and the cycle of life.`,
            letter: `Dear Friend,\n\nI hope this letter finds you well. I am writing to share my thoughts on ${essayTopic.value}.\n\nRecently, I have been thinking a lot about this topic. It is something that has been on my mind for quite some time, and I believe it is important to share my feelings with you.\n\nAs far as I am concerned, we should pay more attention to this issue and take positive actions. I believe that with our joint efforts, things will get better.\n\nLooking forward to hearing from you soon.\n\nSincerely yours,\nLi Ming`,
            speech: `Ladies and gentlemen,\n\nGood morning! Today I am very honored to stand here and share my thoughts on ${essayTopic.value}.\n\nAs we all know, this is a topic that concerns each and every one of us. It affects our daily lives and shapes our future. That is why I feel it is so important for us to discuss it today.\n\nI firmly believe that through our collective efforts and wisdom, we can make a real difference. Let us work together towards a better tomorrow.\n\nThank you for your attention!`
        }

        essayResult.value = mockEssays[essayType.value] || mockEssays['narrative']
        message.success('作文生成成功')
    } catch (error) {
        message.error('作文生成失败，请稍后重试')
        console.error('生成作文错误:', error)
    } finally {
        loading.value = false
    }
}

const copyEssay = () => {
    if (essayResult.value) {
        navigator.clipboard.writeText(essayResult.value)
            .then(() => message.success('已复制到剪贴板'))
            .catch(() => message.error('复制失败，请手动复制'))
    }
}
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.essay-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(176deg, #eeefff 2.1%, #fff 45.26%);
}

.main-content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    padding-bottom: 40px;
}

/* 页面头部 */
.page-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 28px;
    padding-top: 4px;
}

.back-btn {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    border: none;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
    color: #475569;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s;
}

.back-btn:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
}

.header-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.page-title {
    font-size: 22px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    letter-spacing: -0.3px;
}

.page-subtitle {
    font-size: 13px;
    color: #94a3b8;
    margin: 0;
}

/* 分组标题 */
.section-title {
    font-size: 18px;
    font-weight: 500;
    color: #1e293b;
    margin: 0 0 12px;
    padding-top: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.optional {
    font-size: 12px;
    color: #94a3b8;
    font-weight: 400;
}

/* 卡片 */
.card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border-radius: 20px;
    padding: 18px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(102, 126, 234, 0.08);
    border: 1px solid rgba(102, 126, 234, 0.1);
}

/* 标签选择组 */
.tag-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.tag-btn {
    height: 36px;
    padding: 0 16px;
    border-radius: 80px;
    border: 1.5px solid rgba(102, 126, 234, 0.18);
    background: rgba(241, 245, 249, 0.6);
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.tag-btn:hover {
    border-color: rgba(123, 104, 255, 0.4);
    color: #7b68ff;
    background: rgba(123, 104, 255, 0.05);
}

.tag-btn.active {
    background: linear-gradient(90deg, rgba(123, 104, 255, 0.12) 0%, rgba(51, 112, 255, 0.12) 100%);
    border-color: rgba(123, 104, 255, 0.4);
    color: #7b68ff;
    font-weight: 700;
}

/* 输入框 */
.input-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
}

.input-icon {
    color: #94a3b8;
    flex-shrink: 0;
}

.bare-input {
    flex: 1;
    font-size: 15px;
    color: #1e293b;
}

.textarea-card {
    padding: 12px 18px;
}

.bare-textarea {
    font-size: 14px;
    color: #334155;
    line-height: 1.6;
    resize: none;
}

/* 生成按钮 */
.generate-btn {
    width: 100%;
    height: 52px;
    border-radius: 80px;
    border: none;
    background: linear-gradient(90deg, rgba(123, 104, 255, 0.9) 0%, rgba(51, 112, 255, 0.9) 100%);
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 6px 20px rgba(123, 104, 255, 0.3);
    transition: all 0.2s ease;
    margin-bottom: 28px;
}

.generate-btn:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 8px 26px rgba(123, 104, 255, 0.4);
}

.generate-btn:active:not(:disabled) {
    transform: scale(0.98);
}

.generate-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* 加载点 */
.loading-dots {
    display: flex;
    gap: 5px;
    align-items: center;
}

.loading-dots span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #fff;
    animation: dot-bounce 0.8s ease-in-out infinite;
}

.loading-dots span:nth-child(2) { animation-delay: 0.15s; }
.loading-dots span:nth-child(3) { animation-delay: 0.3s; }

@keyframes dot-bounce {
    0%, 100% { transform: translateY(0); opacity: 0.6; }
    50% { transform: translateY(-5px); opacity: 1; }
}

/* 结果区 */
.result-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.copy-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 500;
    color: #667eea;
    background: rgba(102, 126, 234, 0.08);
    border: none;
    border-radius: 20px;
    padding: 4px 12px;
    cursor: pointer;
    transition: all 0.2s;
}

.copy-btn:hover {
    background: rgba(102, 126, 234, 0.14);
}

.result-card {
    padding: 20px;
}

.result-title {
    font-size: 17px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 14px;
}

.result-divider {
    height: 1px;
    background: rgba(102, 126, 234, 0.1);
    margin-bottom: 14px;
}

.result-body {
    font-size: 14px;
    line-height: 1.8;
    color: #334155;
    white-space: pre-wrap;
    margin: 0;
}

/* Ant Design 覆盖 */
:deep(.ant-input) {
    background: transparent !important;
    font-size: 15px;
    color: #1e293b;
    padding: 0;
}

:deep(.ant-input-textarea textarea) {
    background: transparent !important;
    font-size: 14px;
    color: #334155;
    padding: 0;
    line-height: 1.7;
}
</style>
