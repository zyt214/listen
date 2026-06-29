<template>
    <div class="register-page">
        <div class="bg-circle bg-circle-1"></div>
        <div class="bg-circle bg-circle-2"></div>

        <div class="register-box">
            <div class="register-header">
                <div class="logo-wrap">
                    <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                        <rect width="48" height="48" rx="14" fill="url(#register-lg)" />
                        <path d="M14 24a10 10 0 0 1 20 0" stroke="#fff" stroke-width="3" stroke-linecap="round" />
                        <circle cx="24" cy="34" r="3" fill="#fff" />
                        <defs>
                            <linearGradient id="register-lg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#7b68ff" />
                                <stop offset="1" stop-color="#3370ff" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <h1 class="register-title">创建账号</h1>
                <p class="register-subtitle">开始使用听写天天练</p>
            </div>

            <form @submit.prevent="handleRegister" class="register-form">
                <div class="form-group">
                    <label>昵称</label>
                    <div class="input-wrap" :class="{ 'has-error': nicknameError }">
                        <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21a8 8 0 0 0-16 0" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <a-input
                            v-model:value="nickname"
                            placeholder="请输入昵称"
                            :status="nicknameError ? 'error' : ''"
                            :bordered="false"
                            class="bare-input"
                        />
                    </div>
                    <div v-if="nicknameError" class="error-msg">{{ nicknameError }}</div>
                </div>

                <div class="form-group">
                    <label>手机号</label>
                    <div class="input-wrap" :class="{ 'has-error': phoneError }">
                        <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.9 19.79 19.79 0 0 1 1.61 3.27 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.49 5.49l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 15.5v1.42z" />
                        </svg>
                        <a-input
                            v-model:value="phone"
                            placeholder="请输入手机号"
                            :status="phoneError ? 'error' : ''"
                            :bordered="false"
                            class="bare-input"
                        />
                    </div>
                    <div v-if="phoneError" class="error-msg">{{ phoneError }}</div>
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
                            placeholder="至少 8 位密码"
                            :status="passwordError ? 'error' : ''"
                            :bordered="false"
                            class="bare-input"
                        />
                    </div>
                    <div v-if="passwordError" class="error-msg">{{ passwordError }}</div>
                </div>

                <div class="form-group">
                    <label>确认密码</label>
                    <div class="input-wrap" :class="{ 'has-error': confirmPasswordError }">
                        <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 6 9 17l-5-5" />
                        </svg>
                        <a-input-password
                            v-model:value="confirmPassword"
                            placeholder="请再次输入密码"
                            :status="confirmPasswordError ? 'error' : ''"
                            :bordered="false"
                            class="bare-input"
                        />
                    </div>
                    <div v-if="confirmPasswordError" class="error-msg">{{ confirmPasswordError }}</div>
                </div>

                <button type="submit" class="register-btn" :disabled="loading">
                    <span v-if="!loading">注 册</span>
                    <span v-else class="loading-dots">
                        <span></span><span></span><span></span>
                    </span>
                </button>

                <div class="auth-switch">
                    <span>已有账号？</span>
                    <router-link to="/login">去登录</router-link>
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

const nickname = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const nicknameError = ref('')
const phoneError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

const validateForm = () => {
    let isValid = true
    const trimmedNickname = nickname.value.trim()
    const trimmedPhone = phone.value.trim()

    if (trimmedNickname.length < 2) {
        nicknameError.value = '昵称至少 2 个字符'
        isValid = false
    } else {
        nicknameError.value = ''
    }

    if (!/^1[3-9]\d{9}$/.test(trimmedPhone)) {
        phoneError.value = '请输入正确的手机号'
        isValid = false
    } else {
        phoneError.value = ''
    }

    if (password.value.length < 8) {
        passwordError.value = '密码至少 8 位'
        isValid = false
    } else {
        passwordError.value = ''
    }

    if (confirmPassword.value !== password.value) {
        confirmPasswordError.value = '两次输入的密码不一致'
        isValid = false
    } else {
        confirmPasswordError.value = ''
    }

    return isValid
}

const getErrorMessage = (error: unknown) => {
    const responseMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message
    return responseMessage || '注册失败，请稍后重试'
}

const handleRegister = async () => {
    if (!validateForm()) return

    loading.value = true
    try {
        await authStore.register({
            username: nickname.value.trim(),
            phone: phone.value.trim(),
            password: password.value
        })
        message.success('注册成功')
        router.push('/')
    } catch (error) {
        message.error(getErrorMessage(error))
        console.error('注册错误:', error)
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.register-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(176deg, #eeefff 2.1%, #fff 45.26%);
    padding: 24px;
    position: relative;
    overflow: hidden;
}

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

.register-box {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    border-radius: 28px;
    padding: 36px 32px 32px;
    box-shadow: 0 8px 40px rgba(102, 126, 234, 0.13), 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(102, 126, 234, 0.12);
}

.register-header {
    text-align: center;
    margin-bottom: 28px;
}

.logo-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
}

.register-title {
    font-size: 26px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 6px;
    letter-spacing: 0;
}

.register-subtitle {
    font-size: 14px;
    color: #94a3b8;
    margin: 0;
}

.register-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
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

.register-btn {
    margin-top: 4px;
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

.register-btn:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 8px 26px rgba(123, 104, 255, 0.45);
}

.register-btn:active:not(:disabled) {
    transform: scale(0.98);
}

.register-btn:disabled {
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

.loading-dots span:nth-child(2) {
    animation-delay: 0.15s;
}

.loading-dots span:nth-child(3) {
    animation-delay: 0.3s;
}

@keyframes dot-bounce {
    0%, 100% {
        transform: translateY(0);
        opacity: 0.6;
    }
    50% {
        transform: translateY(-5px);
        opacity: 1;
    }
}

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

@media (max-width: 480px) {
    .register-page {
        padding: 18px;
        align-items: flex-start;
    }

    .register-box {
        margin-top: 18px;
        padding: 30px 22px 28px;
        border-radius: 24px;
    }
}
</style>
