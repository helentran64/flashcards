<template>
  <v-container>
    <v-card class="px-6 py-8 text-center mx-auto rounded" max-width="400">
      <h2 class="font-weight-bold mb-6">Create an Account</h2>
      <span class="text-red text-center">{{ errorMessages }}</span>
      <v-text-field
        label="First name"
        variant="outlined"
        :rules="[required]"
        density="compact"
        v-model="firstName"
      ></v-text-field>
      <v-text-field
        label="Last name"
        variant="outlined"
        :rules="[required]"
        density="compact"
        v-model="lastName"
      ></v-text-field>
      <v-text-field
        label="Email"
        variant="outlined"
        type="email"
        :rules="[required]"
        density="compact"
        v-model="email"
      ></v-text-field>
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
      <v-btn color="primary" class="mt-4" block @click="signup">Sign Up</v-btn>
      <div class="my-4">
        <p>
          Already have an account?
          <RouterLink to="/log-in" class="router-link-item">Log in</RouterLink>
        </p>
      </div>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import api from '@/api'

const userStore = useUserStore()
const router = useRouter()
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const username = ref('')
const password = ref('')
const errorMessages = ref('')

async function signup() {
  const user = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    username: username.value,
    password: password.value,
  }
  try {
    // only create user if username is unique
    const existingUser = await api.get(`/user/get_by_username/${username.value}`)
    if (existingUser.data && existingUser.data.success) {
      errorMessages.value = 'Username already exists. Please choose another one.'
      return
    } else {
      const res = await api.post(`/user/create`, user)
      if (res.data && res.data.success) {
        const user = await api.get(`/user/get_by_username/${username.value}`)
        if (user.data && user.data.success) {
          userStore.login({
            username: user.data.data.username,
            firstName: user.data.data.firstName,
            lastName: user.data.data.lastName,
            email: user.data.data.email,
          })
          router.push('/')
        }
      }
    }
  } catch (error) {
    console.error('Error checking existing user:', error)
  }
}

function required(v: string) {
  return !!v || 'Field is required'
}
</script>
