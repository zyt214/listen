<template>
    <div class="bottom-nav-wrap">
        <div class="bottom-nav">
            <div v-for="item in navItems" :key="item.path" class="nav-item" :class="{ active: currentPath === item.path }" @click="navigate(item.path)">
                <div class="nav-icon-bg" :class="{ 'icon-bg-active': currentPath === item.path }">
                    <component :is="item.icon" class="nav-icon" />
                </div>
                <span class="nav-label">{{ item.label }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const currentPath = computed(() => route.path)

const navigate = (path: string) => {
    if (currentPath.value !== path) {
        router.push(path)
    }
}

// 爱学图标（书本+星）
const IconAixue = defineComponent({
    render: () =>
        h('svg', { viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
            h('path', {
                d: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z',
                stroke: 'currentColor',
                'stroke-width': '1.8',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round'
            }),
            h('path', {
                d: 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
                stroke: 'currentColor',
                'stroke-width': '1.8',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round'
            }),
            // 装饰星
            h('path', {
                d: 'M17.5 2.5 L18 4 L19.5 4.5 L18 5 L17.5 6.5 L17 5 L15.5 4.5 L17 4 Z',
                fill: 'currentColor',
                opacity: '0.8'
            })
        ])
})

// 学习图标（铅笔+星）
const IconXuexi = defineComponent({
    render: () =>
        h('svg', { viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
            h('path', {
                d: 'M12 20h9',
                stroke: 'currentColor',
                'stroke-width': '1.8',
                'stroke-linecap': 'round'
            }),
            h('path', {
                d: 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z',
                stroke: 'currentColor',
                'stroke-width': '1.8',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round'
            }),
            h('path', {
                d: 'M5 2.5 L5.4 3.8 L6.7 4.2 L5.4 4.6 L5 5.9 L4.6 4.6 L3.3 4.2 L4.6 3.8 Z',
                fill: 'currentColor',
                opacity: '0.8'
            })
        ])
})

// 发现图标（指南针+星）
const IconFaxian = defineComponent({
    render: () =>
        h('svg', { viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
            h('circle', {
                cx: '12',
                cy: '12',
                r: '9',
                stroke: 'currentColor',
                'stroke-width': '1.8'
            }),
            h('path', {
                d: 'M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z',
                stroke: 'currentColor',
                'stroke-width': '1.8',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round'
            }),
            h('path', {
                d: 'M19 2.5 L19.3 3.5 L20.3 3.8 L19.3 4.1 L19 5.1 L18.7 4.1 L17.7 3.8 L18.7 3.5 Z',
                fill: 'currentColor',
                opacity: '0.8'
            })
        ])
})

// 我的图标（笑脸+星）
const IconWode = defineComponent({
    render: () =>
        h('svg', { viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
            h('circle', {
                cx: '12',
                cy: '12',
                r: '9',
                stroke: 'currentColor',
                'stroke-width': '1.8'
            }),
            h('path', {
                d: 'M8 14s1.5 2 4 2 4-2 4-2',
                stroke: 'currentColor',
                'stroke-width': '1.8',
                'stroke-linecap': 'round'
            }),
            h('circle', { cx: '9.5', cy: '11', r: '0.8', fill: 'currentColor' }),
            h('circle', { cx: '14.5', cy: '11', r: '0.8', fill: 'currentColor' }),
            // 装饰星
            h('path', {
                d: 'M18.5 3.5 L18.9 4.7 L20.1 5.1 L18.9 5.5 L18.5 6.7 L18.1 5.5 L16.9 5.1 L18.1 4.7 Z',
                fill: 'currentColor',
                opacity: '0.9'
            })
        ])
})

const navItems = [
    { path: '/', label: '爱学', icon: IconAixue },
    { path: '/exam', label: '试卷', icon: IconFaxian },
    { path: '/study', label: '学习', icon: IconXuexi },
    { path: '/my', label: '我的', icon: IconWode }
]
</script>

<style scoped>
.bottom-nav-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 200;
    display: flex;
    justify-content: center;
    padding: 0 16px max(16px, env(safe-area-inset-bottom));
    padding-bottom: calc(10px + env(safe-area-inset-bottom));
    pointer-events: none;
}

.bottom-nav {
    pointer-events: all;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 36px;
    padding: 8px 12px;
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08);
    width: 100%;
    max-width: 420px;
    gap: 4px;
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    cursor: pointer;
    flex: 1;
    padding: 4px 0;
    -webkit-tap-highlight-color: transparent;
    transition: transform 0.15s ease;
}

.nav-item:active {
    transform: scale(0.92);
}

.nav-icon-bg {
    width: 48px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 18px;
    transition: all 0.25s ease;
    color: #aab4c8;
}

.nav-icon-bg.icon-bg-active {
    background: linear-gradient(135deg, rgba(123, 104, 255, 0.12) 0%, rgba(51, 112, 255, 0.12) 100%);
    color: #7b68ff;
}

.nav-icon {
    width: 22px;
    height: 22px;
    transition: color 0.25s ease;
}

.nav-label {
    font-size: 11px;
    font-weight: 500;
    color: #aab4c8;
    line-height: 1;
    transition: all 0.25s ease;
    letter-spacing: 0.2px;
}

.nav-item.active .nav-label {
    color: #7b68ff;
    font-weight: 700;
}
</style>
