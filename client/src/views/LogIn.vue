<template>
  <v-container>
    <v-card class="px-6 py-8 text-center mx-auto rounded" max-width="400">
      <h2 class="font-weight-bold mb-6">Login</h2>
      <p v-if="loginError" class="text-center text-red">Unable to login</p>
      <v-text-field
        label="Username"
        variant="outlined"
        :rules="[required]"
        density="compact"
        v-model="username"
      ></v-text-field>
      <v-text-field
        label="Password"
        variant="outlined"
        type="password"
        :rules="[required]"
        density="compact"
        v-model="password"
      ></v-text-field>
      <v-btn color="primary" class="mt-4" block @click="LogUserIn">Login</v-btn>
      <div class="my-4">
        <p>
          Don't have an account?
          <RouterLink to="/sign-up" class="router-link-item">Sign Up</RouterLink>
        </p>
      </div>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const router = useRouter()
const loginError = ref(false)
const username = ref('')
const password = ref('')

async function LogUserIn() {
  try {
    const res = await api.get(`/user/get_by_username/${username.value}`)
    if (res.data.data.password === password.value) {
      userStore.login(res.data.data)
      router.push('/')
    } else {
      loginError.value = true
    }
  } catch {
    loginError.value = true
  }
}

function required(v: string) {
  return !!v || 'Field is required'
}
</script>
