import { ref } from 'vue'

const isOpen = ref(false)
const currentUrl = ref('')
const currentVerse = ref('')

export function useBibleViewer() {
  function open(url, verse) {
    currentUrl.value = url
    currentVerse.value = verse
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  return { isOpen, currentUrl, currentVerse, open, close }
}
