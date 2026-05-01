import { ref } from 'vue'

export function useToast() {
  const toast = ref('')
  let timer = null

  function showToast(msg) {
    toast.value = msg
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => { toast.value = '' }, 2000)
  }

  return { toast, showToast }
}
