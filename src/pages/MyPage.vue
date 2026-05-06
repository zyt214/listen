<template>
    <div class="my-page">
        <div class="main-content">
            <!-- 顶部用户信息 Banner -->
            <div class="user-banner">
                <div class="user-avatar">
                    <span class="avatar-text">{{ userInitial }}</span>
                </div>
                <div class="user-info">
                    <h2 class="username">{{ authStore.user?.username || '用户' }}</h2>
                    <p class="user-desc">欢迎使用天天练听写</p>
                </div>
            </div>

            <!-- 学习管理 -->
            <div class="section-title">学习管理</div>
            <div class="menu-group">
                <div class="menu-item" @click="goToErrorBook">
                    <div class="menu-icon-wrap error-book">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                    </div>
                    <div class="menu-info">
                        <span class="menu-title">错题本</span>
                        <span class="menu-desc">{{ errorBookCount > 0 ? `${errorBookCount} 条错题` : '暂无错题' }}</span>
                    </div>
                    <span v-if="errorBookCount > 0" class="badge">{{ errorBookCount }}</span>
                    <svg class="menu-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </div>
            </div>

            <!-- 设置 -->
            <div class="section-title">设置</div>
            <div class="menu-group">
                <div class="menu-item danger" @click="handleLogout">
                    <div class="menu-icon-wrap logout">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </div>
                    <div class="menu-info">
                        <span class="menu-title logout-text">退出登录</span>
                    </div>
                    <svg class="menu-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </div>
            </div>
        </div>

        <div class="bottom-nav-spacer"></div>
        <BottomNav />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAuthStore } from '../stores/auth'
import { useErrorBookStore } from '../stores/errorBook'
import { showConfirm } from '../utils/confirm'
import BottomNav from '../components/BottomNav.vue'

const router = useRouter()
const authStore = useAuthStore()
const errorBookStore = useErrorBookStore()

const errorBookCount = computed(() => errorBookStore.records.length)

const userInitial = computed(() => {
    const username = authStore.user?.username || '用户'
    return username.charAt(0).toUpperCase()
})

const goToErrorBook = () => router.push('/errorBook')

const handleLogout = () => {
    showConfirm({
        title: '确认退出',
        content: '确定要退出登录吗？',
        okText: '退出',
        onOk: () => {
            authStore.logout()
            message.success('退出登录成功')
            router.push('/login')
        }
    })
}
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.my-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(176deg, #eeefff 2.1%, #fff 45.26%);
}

.main-content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    padding-bottom: 80px;
}

/* 用户 Banner */
.user-banner {
    display: flex;
    align-items: center;
    gap: 18px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border-radius: 20px;
    padding: 24px 20px;
    margin-bottom: 28px;
    box-shadow: 0 2px 10px rgba(102, 126, 234, 0.08);
    border: 1px solid rgba(102, 126, 234, 0.1);
}

.user-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #7b68ff 0%, #3370ff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 14px rgba(123, 104, 255, 0.35);
    flex-shrink: 0;
}

.avatar-text {
    font-size: 22px;
    font-weight: 700;
    color: #fff;
}

.user-info {
    flex: 1;
}

.username {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 4px;
    letter-spacing: -0.2px;
}

.user-desc {
    font-size: 13px;
    color: #94a3b8;
    margin: 0;
}

/* 分组标题 */
.section-title {
    font-size: 18px;
    font-weight: 500;
    color: #1e293b;
    margin: 0 0 16px;
    padding-top: 10px;
}

/* 菜单组 */
.menu-group {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(102, 126, 234, 0.08);
    border: 1px solid rgba(102, 126, 234, 0.1);
    margin-bottom: 24px;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 18px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 1px solid rgba(102, 126, 234, 0.06);
}

.menu-item:last-child {
    border-bottom: none;
}

.menu-item:hover {
    background: rgba(102, 126, 234, 0.04);
}

.menu-item:active {
    transform: scale(0.99);
}

/* 图标 */
.menu-icon-wrap {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.menu-icon-wrap.error-book {
    background: linear-gradient(135deg, rgba(240, 147, 251, 0.15) 0%, rgba(245, 87, 108, 0.15) 100%);
    color: #f5576c;
}

.menu-icon-wrap.logout {
    background: rgba(248, 113, 113, 0.1);
    color: #ef4444;
}

.menu-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.menu-title {
    font-size: 15px;
    font-weight: 600;
    color: #334155;
}

.menu-desc {
    font-size: 12px;
    color: #94a3b8;
}

.logout-text {
    color: #ef4444;
}

.badge {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 20px;
}

.menu-arrow {
    color: #cbd5e1;
    flex-shrink: 0;
}

.bottom-nav-spacer {
    height: 80px;
    flex-shrink: 0;
}
</style>
