import { defineStore } from 'pinia'
import api from '../utils/api'

interface User {
    id: number
    phone: string
    username: string
    role: string
    status: number
    lastLoginAt?: string
    createdAt?: string
    updatedAt?: string
}

interface AuthPayload {
    phone: string
    password: string
    username?: string
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        accessToken: '',
        isAuthenticated: false,
        hasCheckedSession: false
    }),

    getters: {
        getUser(): User | null {
            return this.user
        },
        getToken(): string | null {
            return this.accessToken || null
        },
        getIsAuthenticated(): boolean {
            return this.isAuthenticated
        }
    },

    actions: {
        setSession(payload: { user: User; accessToken: string }) {
            this.user = payload.user
            this.accessToken = payload.accessToken
            this.isAuthenticated = true
            this.hasCheckedSession = true
        },
        async login(payload: AuthPayload) {
            const response = await api.post('/auth/login', payload)
            this.setSession(response.data.data)
        },
        async register(payload: AuthPayload) {
            const response = await api.post('/auth/register', payload)
            this.setSession(response.data.data)
        },
        clearSession() {
            this.user = null
            this.accessToken = ''
            this.isAuthenticated = false
        },
        async logout() {
            try {
                await api.post('/auth/logout')
            } finally {
                this.clearSession()
                this.hasCheckedSession = true
            }
        },
        async checkAuth() {
            if (this.hasCheckedSession) {
                return this.isAuthenticated
            }

            try {
                const response = await api.post('/auth/refresh')
                this.setSession(response.data.data)
                return true
            } catch (error) {
                this.clearSession()
                this.hasCheckedSession = true
                return false
            }
        }
    }
})
