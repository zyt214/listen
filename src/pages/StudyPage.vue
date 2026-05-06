<template>
    <div class="study-page">
        <div class="header">
            <a-button type="text" class="back-btn" @click="goBack">
                <LeftOutlined />
            </a-button>
            <h2 class="header-title">学习</h2>
            <div class="header-spacer"></div>
        </div>

        <div class="content">
            <div class="empty-content">
                <div class="empty-icon">📚</div>
                <h3 class="empty-title">学习模块</h3>
                <p class="empty-text">页面内容暂时为空</p>
            </div>
        </div>
        <BottomNav />
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { LeftOutlined } from '@ant-design/icons-vue'
import { Button } from 'ant-design-vue'
import BottomNav from '../components/BottomNav.vue'

const router = useRouter()

const goBack = () => {
    router.back()
}
</script>

<style scoped>
.study-page {
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
    align-items: center;
    justify-content: center;
}

.empty-content {
    text-align: center;
    background: #ffffff;
    border-radius: 16px;
    padding: 48px 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
}

.empty-icon {
    font-size: 64px;
    margin-bottom: 24px;
}

.empty-title {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 8px 0;
}

.empty-text {
    font-size: 16px;
    color: #64748b;
    margin: 0;
}
</style>