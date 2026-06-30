<template>
    <div class="exam-records">
        <div class="header">
            <a-button type="text" class="back-btn" @click="goBack">
                <LeftOutlined />
            </a-button>
            <h2 class="header-title">试卷记录</h2>
            <div class="header-spacer"></div>
        </div>

        <div class="content">
            <!-- 空状态 -->
            <a-empty v-if="examRecords.length === 0" description="暂无试卷记录，新建后将会显示" style="padding: 64px 24px">
                <template #icon>
                    <span class="empty-icon">📋</span>
                </template>
                <template #description>
                    <div class="empty-content">
                        <h3 class="empty-title">暂无试卷记录</h3>
                        <p class="empty-desc">暂无试卷记录，新建后将会显示</p>
                    </div>
                </template>
                <a-button type="primary" @click="createNewExam"> 创建新考试 </a-button>
            </a-empty>

            <!-- 试卷记录列表 -->
            <div v-else class="records-container">
                <div v-for="item in examRecords" :key="item.id" class="record-card">
                    <div class="record-header">
                        <h3 class="record-title">{{ item.name }}</h3>
                        <div class="record-actions">
                            <a-button type="primary" size="small" @click="viewExamDetail(item)" class="action-btn view-btn">
                                <template #icon>
                                    <a-icon type="eye" />
                                </template>
                                查看详情
                            </a-button>
                            <div style="display: flex; gap: 8px; flex-direction: column">
                                <a-button size="small" @click="exportPDF(item)" class="action-btn export-btn">
                                    <template #icon>
                                        <a-icon type="download" />
                                    </template>
                                    导出PDF
                                </a-button>
                                <a-button size="small" danger @click="deleteExamRecord(item.id)" class="action-btn delete-btn">
                                    <template #icon>
                                        <a-icon type="delete" />
                                    </template>
                                    删除
                                </a-button>
                            </div>
                        </div>
                    </div>
                    <div class="record-meta">
                        <div class="meta-item">
                            <span class="meta-label">考试日期：</span>
                            <span class="meta-value">{{ item.date }}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">使用教材：</span>
                            <span class="meta-value">{{ item.textbookName }}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">单词数量：</span>
                            <span class="meta-value">{{ item.wordCount }}个</span>
                        </div>
                    </div>
                    <div class="record-stats">
                        <div>预计导出结果</div>
                        <div class="stat-item">
                            <span class="stat-number">{{ item.words.length }}</span>
                            <span class="stat-label">总单词</span>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat-item">
                            <span class="stat-number">{{ Math.ceil(item.words.length / 2) }}</span>
                            <span class="stat-label">英译汉</span>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat-item">
                            <span class="stat-number">{{ Math.floor(item.words.length / 2) }}</span>
                            <span class="stat-label">汉译英</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { LeftOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { generatePDF, ExamRecord } from '../utils/pdfExport'
import { showConfirm } from '../utils/confirm'
import { studyAPI } from '../utils/api'

const router = useRouter()
const examRecords = ref<ExamRecord[]>([])

const goBack = () => {
    router.back()
}

const createNewExam = () => {
    router.push('/exam')
}

const viewExamDetail = (record: ExamRecord) => {
    // 跳转到考试结果页面，并传递记录ID
    router.push(`/exam/result?examId=${record.id}`)
}

const deleteExamRecord = (id: number) => {
    showConfirm({
        title: '确认删除',
        content: '确定要删除这条试卷记录吗？',
        okText: '确定',
        cancelText: '取消',
        async onOk() {
            try {
                await studyAPI.deleteExamRecord(id)
                await loadExamRecords()
                message.success('删除成功')
            } catch (error) {
                console.error('删除试卷记录失败:', error)
            }
        }
    })
}

const exportPDF = (record: ExamRecord) => {
    generatePDF(record)
}

const loadExamRecords = async () => {
    try {
        const response = await studyAPI.getExamRecords({ page: 1, pageSize: 100 })
        examRecords.value = response.data.data || []
    } catch (error) {
        console.error('加载试卷记录失败:', error)
        examRecords.value = []
    }
}

onMounted(async () => {
    await loadExamRecords()
})
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.exam-records {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
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
    padding: 24px;
    overflow-y: auto;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

.records-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.record-card {
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    padding: 24px;
}

.record-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.1), 0 6px 12px -3px rgba(0, 0, 0, 0.05);
}

.record-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    gap: 20px;
}

.record-title {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    line-height: 1.3;
    flex: 1;
}

.record-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
    justify-content: space-between;
}

.action-btn {
    border-radius: 10px !important;
    font-weight: 500 !important;
    transition: all 0.3s ease !important;
}

.view-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    border: none !important;
    max-width: 200px;
}

.view-btn:hover {
    background: linear-gradient(135deg, #7c8ff2 0%, #8b5cb2 100%) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
}

.export-btn {
    background: #f0fdfa !important;
    color: #0d9488 !important;
    border: 1px solid #ccfbf1 !important;
}

.export-btn:hover {
    background: #ccfbf1 !important;
    transform: translateY(-2px) !important;
}

.delete-btn {
    background: #fef2f2 !important;
    color: #dc2626 !important;
    border: 1px solid #fee2e2 !important;
}

.delete-btn:hover {
    background: #fee2e2 !important;
    transform: translateY(-2px) !important;
}

.record-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f1f5f9;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

.meta-label {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
}

.meta-value {
    font-size: 14px;
    color: #1e293b;
    font-weight: 600;
}

.record-stats {
    display: flex;
    align-items: center;
    gap: 24px;
    padding-top: 20px;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.stat-number {
    font-size: 24px;
    font-weight: 700;
    color: #667eea;
    line-height: 1;
}

.stat-label {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
    text-align: center;
}

.stat-divider {
    width: 1px;
    height: 40px;
    background: #e2e8f0;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .record-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .record-actions {
        width: 100%;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .action-btn {
        flex: 1;
        min-width: 100px;
    }

    .record-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .record-stats {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .stat-divider {
        width: 100%;
        height: 1px;
    }

    .stat-item {
        flex-direction: row;
        gap: 12px;
        align-items: center;
    }

    .stat-number {
        font-size: 20px;
    }
}

.empty-icon {
    font-size: 80px;
    opacity: 0.5;
    margin-bottom: 24px;
    display: block;
}

.empty-content {
    text-align: center;
    padding: 32px 0;
}

.empty-title {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 12px 0;
    letter-spacing: -0.3px;
}

.empty-desc {
    font-size: 16px;
    color: #64748b;
    margin: 0 0 32px 0;
    line-height: 1.6;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
}

/* 覆盖 Ant Design Vue 样式 */
:deep(.ant-card) {
    border-radius: 18px !important;
    border: 1px solid rgba(0, 0, 0, 0.05);
}

:deep(.ant-card-body) {
    padding: 24px !important;
}

:deep(.ant-btn-primary) {
    border-radius: 12px;
    height: 48px;
    font-weight: 600;
    font-size: 16px;
    padding: 0 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    border: none !important;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    transition: all 0.3s ease;
}

:deep(.ant-btn-primary:hover) {
    background: linear-gradient(135deg, #7c8ff2 0%, #8b5cb2 100%) !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5);
}

:deep(.ant-list-item) {
    padding: 0 !important;
    margin-bottom: 20px;
}

:deep(.ant-empty) {
    padding: 96px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

:deep(.ant-tag) {
    border-radius: 16px;
    font-size: 13px;
    padding: 4px 12px;
    font-weight: 500;
    margin-right: 8px !important;
    margin-bottom: 8px;
    display: inline-block;
}

:deep(.ant-tag:last-child) {
    margin-right: 0 !important;
}

:deep(.ant-typography-title) {
    color: #1e293b;
    font-weight: 700;
    margin-bottom: 12px !important;
}

:deep(.ant-typography-paragraph) {
    margin-bottom: 16px !important;
}

:deep(.ant-space) {
    margin-top: 16px !important;
}

:deep(.ant-btn) {
    border-radius: 10px;
    font-weight: 500;
    transition: all 0.3s ease;
}

:deep(.ant-btn:hover) {
    transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .content {
        padding: 16px;
    }

    .record-card {
        margin-bottom: 16px;
    }

    :deep(.ant-card-body) {
        padding: 20px !important;
    }

    :deep(.ant-empty) {
        padding: 64px 16px;
    }

    .empty-title {
        font-size: 20px;
    }

    .empty-icon {
        font-size: 64px;
    }
}
</style>
