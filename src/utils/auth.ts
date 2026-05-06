import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// 登录校验公共方法
export const checkLogin = (): boolean => {
    const authStore = useAuthStore()
    // 检查是否已登录
    if (!authStore.getIsAuthenticated) {
        // 未登录，跳转到登录页面
        const router = useRouter()
        router.push('/login')
        return false
    }
    return true
}

// 登录校验装饰器，用于路由守卫
export const requireAuth = (to: any, from: any, next: any) => {
    const authStore = useAuthStore()
    if (!authStore.getIsAuthenticated) {
        next('/login')
    } else {
        next()
    }
}
