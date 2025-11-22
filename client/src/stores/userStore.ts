import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

type User = {
  username: string
  fullName: string
  email: string
}

export const useUserStore = defineStore('user', () => {
  const user = useLocalStorage<User | null>('user', null)
  const isLoggedIn = useLocalStorage<boolean>('isLoggedIn', false)
  const isLoggedOut = useLocalStorage<boolean>('isLoggedOut', true)

  function login(userData: User) {
    isLoggedIn.value = true
    isLoggedOut.value = false
    user.value = userData
  }

  function logout() {
    isLoggedIn.value = false
    isLoggedOut.value = true
    user.value = null
  }

  return { isLoggedIn, isLoggedOut, user, login, logout }
})
