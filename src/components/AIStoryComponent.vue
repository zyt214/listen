<template>
    <div class="ai-story-component">
        <div class="header">
            <a-button type="text" class="back-btn" @click="goBack">
                <LeftOutlined />
            </a-button>
            <h2 class="header-title">AI 绘本</h2>
            <div class="header-spacer"></div>
        </div>

        <div class="content">
            <div class="empty-content">
                <div class="empty-icon">📚</div>
                <h3 class="empty-title">AI 绘本</h3>
                <p class="empty-desc">自己可以创造</p>
                <p class="empty-hint">功能开发中，敬请期待</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { LeftOutlined } from '@ant-design/icons-vue'

const router = useRouter()

const goBack = () => {
    router.back()
}
</script>

<style scoped>
.ai-story-component {
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

.content {
    flex: 1;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow-y: auto;
}

.empty-content {
    text-align: center;
    padding: 40px 20px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
}

.empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
}

.empty-title {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #333;
}

.empty-desc {
    font-size: 16px;
    margin: 0 0 16px 0;
    color: #666;
}

.empty-hint {
    font-size: 14px;
    margin: 0;
    color: #999;
}
</style>