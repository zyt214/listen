import { defineStore } from 'pinia'

interface User {
    username: string
    token: string
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        isAuthenticated: false
    }),
    
    getters: {
        getUser(): User | null {
            return this.user
        },
        getToken(): string | null {
            return this.user?.token || null
        },
        getIsAuthenticated(): boolean {
            return this.isAuthenticated
        }
    },
    
    actions: {
        login(user: User) {
            this.user = user
            this.isAuthenticated = true
            // 保存到本地存储
            localStorage.setItem('user', JSON.stringify(user))
        },
        logout() {
            this.user = null
            this.isAuthenticated = false
            // 从本地存储中删除
            localStorage.removeItem('user')
        },
        checkAuth() {
            // 从本地存储中恢复登录状态
            const savedUser = localStorage.getItem('user')
            if (savedUser) {
                try {
                    const user = JSON.parse(savedUser)
                    this.user = user
                    this.isAuthenticated = true
                } catch (error) {
                    console.error('Failed to parse user from localStorage:', error)
                    this.logout()
                }
            }
        }
    }
})
