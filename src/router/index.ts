import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import WordListPage from '../components/WordListPage.vue'
import DictationPage from '../components/DictationPage.vue'
import CorrectionPage from '../components/CorrectionPage.vue'
import ErrorBookPage from '../components/ErrorBookPage.vue'
import TextbookSelector from '../components/TextbookSelector.vue'
import TextbookUnitSelector from '../components/TextbookUnitSelector.vue'
import ExamConfig from '../components/ExamConfig.vue'
import ExamPage from '../components/ExamPage.vue'
import ExamResult from '../components/ExamResult.vue'
import ExamRecords from '../components/ExamRecords.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import PhotoCorrectionPage from '../components/PhotoCorrectionPage.vue'
import OCRResultPage from '../components/OCRResultPage.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: LoginPage
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterPage
    },
    {
        path: '/',
        name: 'Home',
        component: HomePage,
        meta: { requiresAuth: true }
    },
    {
        path: '/upload',
        name: 'Upload',
        component: () => import('../components/ImageRecognizer.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/ocr-result',
        name: 'OCRResult',
        component: OCRResultPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/wordList',
        name: 'WordList',
        component: WordListPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/dictation',
        name: 'Dictation',
        component: DictationPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/photo-correction',
        name: 'PhotoCorrection',
        component: PhotoCorrectionPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/correction',
        name: 'Correction',
        component: CorrectionPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/errorBook',
        name: 'ErrorBook',
        component: ErrorBookPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/textbook',
        name: 'Textbook',
        component: TextbookSelector,
        meta: { requiresAuth: true }
    },
    {
        path: '/textbook/unit',
        name: 'TextbookUnit',
        component: TextbookUnitSelector,
        meta: { requiresAuth: true }
    },

    {
        path: '/exam',
        name: 'Exam',
        component: ExamConfig,
        meta: { requiresAuth: true }
    },
    {
        path: '/exam/records',
        name: 'ExamRecords',
        component: ExamRecords,
        meta: { requiresAuth: true }
    },
    {
        path: '/exam/page',
        name: 'ExamPage',
        component: ExamPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/exam/result',
        name: 'ExamResult',
        component: ExamResult,
        meta: { requiresAuth: true }
    },
    {
        path: '/material',
        name: 'MaterialLibrary',
        component: () => import('../pages/MaterialLibraryPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/my',
        name: 'My',
        component: () => import('../pages/MyPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/essay',
        name: 'Essay',
        component: () => import('../pages/EssayPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/test',
        name: 'Test',
        component: () => import('../pages/TestPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/study',
        name: 'Study',
        component: () => import('../pages/StudyPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vocabulary',
        name: 'Vocabulary',
        component: () => import('../components/VocabularyComponent.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/ai-story',
        name: 'AIStory',
        component: () => import('../components/AIStoryComponent.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/radio',
        name: 'Radio',
        component: () => import('../components/RadioComponent.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/radio/:id',
        name: 'RadioDetail',
        component: () => import('../pages/RadioDetailPage.vue'),
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫
router.beforeEach(async (to) => {
    // 初始化 auth store
    const authStore = useAuthStore()
    await authStore.checkAuth()

    // 检查页面是否需要登录
    if (to.meta.requiresAuth && !authStore.getIsAuthenticated) {
        // 未登录，跳转到登录页面
        return '/login'
    } else if ((to.path === '/login' || to.path === '/register') && authStore.getIsAuthenticated) {
        return '/'
    } else {
        // 已登录或页面不需要登录
        return true
    }
})

export default router
