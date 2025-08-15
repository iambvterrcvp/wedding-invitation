import { ref, onMounted } from 'vue'

export function useTypingAnimation(text: string, options = {}) {
  const displayedText = ref('')
  const isTyping = ref(false)

  const { typeSpeed = 100, startDelay = 0, onComplete = () => {} } = options

  const typeText = () => {
    isTyping.value = true
    let i = 0

    const typeInterval = setInterval(() => {
      if (i < text.length) {
        displayedText.value += text.charAt(i)
        i++
      } else {
        clearInterval(typeInterval)
        isTyping.value = false
        onComplete()
      }
    }, typeSpeed)
  }

  const startTyping = () => {
    displayedText.value = ''
    setTimeout(typeText, startDelay)
  }

  onMounted(() => {
    startTyping()
  })

  return {
    displayedText,
    isTyping,
    startTyping,
  }
}
