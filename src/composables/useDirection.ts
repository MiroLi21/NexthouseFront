import { ref, onMounted } from 'vue'

type Direction = 'ltr' | 'rtl'

export function useDirection() {
    const direction = ref<Direction>('ltr')

    const toggleDirection = () => {
        direction.value = direction.value === 'ltr' ? 'rtl' : 'ltr'
        updateHtmlDirection()
        localStorage.setItem('direction', direction.value)
    }

    const updateHtmlDirection = () => {
        document.documentElement.dir = direction.value
        document.documentElement.setAttribute('data-direction', direction.value)
    }

    onMounted(() => {
        const savedDirection = localStorage.getItem('direction') as Direction | null
        direction.value = savedDirection || 'ltr'
        updateHtmlDirection()
    })

    return { direction, toggleDirection }
}