import { ref, onMounted, watchEffect } from 'vue'

export function useTheme() {
    const theme = ref<'light' | 'dark'>('light')

    const setTheme = (newTheme: 'light' | 'dark') => {
        theme.value = newTheme
        localStorage.setItem('theme', newTheme)
        updateHtmlClass()
    }

    const updateHtmlClass = () => {
        document.documentElement.classList.toggle('dark', theme.value === 'dark')
    }

    onMounted(() => {
        const savedTheme = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        theme.value = savedTheme === 'dark' || (!savedTheme && prefersDark) ? 'dark' : 'light'
        updateHtmlClass()
    })

    watchEffect(updateHtmlClass)

    return { theme, setTheme }
}