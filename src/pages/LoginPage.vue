<template>
    <div class="login-page">
        <!-- 背景装饰圆 -->
        <div class="bg-circle bg-circle-1"></div>
        <div class="bg-circle bg-circle-2"></div>

        <div class="login-box">
            <!-- Logo 区 -->
            <div class="login-header">
                <div class="logo-wrap">
                    <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                        <rect width="48" height="48" rx="14" fill="url(#lg)" />
                        <path d="M14 24a10 10 0 0 1 20 0" stroke="#fff" stroke-width="3" stroke-linecap="round" />
                        <circle cx="24" cy="34" r="3" fill="#fff" />
                        <defs>
                            <linearGradient id="lg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#7b68ff" />
                                <stop offset="1" stop-color="#3370ff" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <h1 class="login-title">听写天天练</h1>
                <p class="login-subtitle">开始你的听写之旅</p>
            </div>

            <!-- 表单 -->
            <form @submit.prevent="handleLogin" class="login-form">
                <div class="form-group">
                    <label>手机号</label>
                    <div class="input-wrap" :class="{ 'has-error': usernameError }">
                        <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.9 19.79 19.79 0 0 1 1.61 3.27 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.49 5.49l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 15.5v1.42z" />
                        </svg>
                        <a-input
                            v-model:value="username"
                            placeholder="请输入手机号"
                            :status="usernameError ? 'error' : ''"
                            :bordered="false"
                            class="bare-input"
                        />
                    </div>
                    <div v-if="usernameError" class="error-msg">{{ usernameError }}</div>
                </div>

                <div class="form-group">
                    <label>密码</label>
                    <div class="input-wrap" :class="{ 'has-error': passwordError }">
                        <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <a-input-password
                            v-model:value="password"
                            placeholder="请输入密码"
                            :status="passwordError ? 'error' : ''"
                            :bordered="false"
                            class="bare-input"
                        />
                    </div>
                    <div v-if="passwordError" class="error-msg">{{ passwordError }}</div>
                </div>

                <button type="submit" class="login-btn" :disabled="loading">
                    <span v-if="!loading">登 录</span>
                    <span v-else class="loading-dots">
                        <span></span><span></span><span></span>
                    </span>
                </button>

                <div class="auth-switch">
                    <span>还没有账号？</span>
                    <router-link to="/register">立即注册</router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const usernameError = ref('')
const passwordError = ref('')

const handleLogin = async () => {
    let isValid = true
    if (!/^1[3-9]\d{9}$/.test(username.value.trim())) {
        usernameError.value = '请输入正确的手机号'
        isValid = false
    } else {
        usernameError.value = ''
    }
    if (password.value.length < 8) {
        passwordError.value = '密码至少 8 位'
        isValid = false
    } else {
        passwordError.value = ''
    }
    if (!isValid) return

    loading.value = true
    try {
        await authStore.login({
            phone: username.value.trim(),
            password: password.value
        })
        message.success('登录成功')
        router.push('/')
    } catch (error) {
        console.error('登录错误:', error)
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(176deg, #eeefff 2.1%, #fff 45.26%);
    padding: 24px;
    position: relative;
    overflow: hidden;
}

/* 背景装饰圆 */
.bg-circle {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.22;
    pointer-events: none;
}

.bg-circle-1 {
    width: 300px;
    height: 300px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    top: -80px;
    right: -60px;
}

.bg-circle-2 {
    width: 260px;
    height: 260px;
    background: linear-gradient(135deg, #7b68ff 0%, #3370ff 100%);
    bottom: 5%;
    left: -80px;
}

/* 登录卡片 */
.login-box {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 400px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    border-radius: 28px;
    padding: 40px 32px 36px;
    box-shadow: 0 8px 40px rgba(102, 126, 234, 0.13), 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(102, 126, 234, 0.12);
}

/* 头部 */
.login-header {
    text-align: center;
    margin-bottom: 36px;
}

.logo-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
}

.login-title {
    font-size: 26px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 6px;
    letter-spacing: -0.4px;
}

.login-subtitle {
    font-size: 14px;
    color: #94a3b8;
    margin: 0;
}

/* 表单 */
.login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-size: 13px;
    font-weight: 600;
    color: #475569;
}

.input-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(241, 245, 249, 0.8);
    border: 1.5px solid rgba(102, 126, 234, 0.12);
    border-radius: 14px;
    padding: 0 14px;
    height: 52px;
    transition: all 0.2s ease;
}

.input-wrap:focus-within {
    border-color: rgba(123, 104, 255, 0.45);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 0 3px rgba(123, 104, 255, 0.1);
}

.input-wrap.has-error {
    border-color: rgba(239, 68, 68, 0.5);
}

.input-icon {
    color: #94a3b8;
    flex-shrink: 0;
}

.input-wrap:focus-within .input-icon {
    color: #7b68ff;
}

.bare-input {
    flex: 1;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    font-size: 15px;
    color: #1e293b;
}

.error-msg {
    font-size: 12px;
    color: #ef4444;
    padding-left: 4px;
}

/* 登录按钮 */
.login-btn {
    margin-top: 8px;
    height: 52px;
    border-radius: 80px;
    border: none;
    background: linear-gradient(90deg, rgba(123, 104, 255, 0.9) 0%, rgba(51, 112, 255, 0.9) 100%);
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 6px 20px rgba(123, 104, 255, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-btn:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 8px 26px rgba(123, 104, 255, 0.45);
}

.login-btn:active:not(:disabled) {
    transform: scale(0.98);
}

.login-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.auth-switch {
    display: flex;
    justify-content: center;
    gap: 6px;
    font-size: 13px;
    color: #64748b;
}

.auth-switch a {
    color: #3370ff;
    font-weight: 700;
    text-decoration: none;
}

.auth-switch a:hover {
    color: #7b68ff;
}

/* 加载动画 */
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

/* Ant Design 输入框覆盖 */
:deep(.ant-input) {
    background: transparent !important;
    font-size: 15px;
    color: #1e293b;
}

:deep(.ant-input-affix-wrapper) {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
}

:deep(.ant-input-password) {
    background: transparent !important;
}
</style>
