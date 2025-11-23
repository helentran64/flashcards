import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

type User = {
  username: string
  firstName: string
  lastName: string
  email: string
}

export const useUserStore = defineStore('user', () => {
  // Load from localStorage on initialization
  const savedUser = localStorage.getItem('user')
  const savedIsLoggedIn = localStorage.getItem('isLoggedIn')

  const user = ref<User | null>(savedUser ? JSON.parse(savedUser) : null)
  const isLoggedIn = ref(savedIsLoggedIn === 'true')
  const isLoggedOut = ref(savedIsLoggedIn !== 'true')

  // Watch and save to localStorage whenever user changes
  watch(
    user,
    (newUser) => {
      if (newUser) {
        localStorage.setItem('user', JSON.stringify(newUser))
      } else {
        localStorage.removeItem('user')
      }
    },
    { deep: true },
  )

  watch(isLoggedIn, (value) => {
    localStorage.setItem('isLoggedIn', String(value))
  })

  function login(userData: User) {
    isLoggedIn.value = true
    isLoggedOut.value = false
    user.value = { ...userData }
  }

  function logout() {
    isLoggedIn.value = false
    isLoggedOut.value = true
    user.value = null
  }

  return { isLoggedIn, isLoggedOut, user, login, logout }
})
