<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useTheme } from 'vuetify'

const theme = useTheme()
function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>

<template>
  <header>
    <div>
      <nav>
        <div class="navbar">
          <RouterLink to="/" class="router-link-item logo mt-2">
            <span class="pl-4 font-weight-bold">myFlashCards</span>
          </RouterLink>
          <span class="navItems">
            <v-btn color="primary" class="mr-2" to="/log-in">Login</v-btn>
            <v-btn color="primary" class="mr-2" to="/sign-up">Sign Up</v-btn>
            <v-btn @click="toggleTheme" icon="mdi-lightbulb-on" variant="plain" class="mb-2" />
          </span>
        </div>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.navbar {
  padding: 15px;
  display: flex;
  justify-content: flex-start;
}
.router-link-item {
  text-decoration: none;
  border-radius: 4px;
  margin-right: 10px;
  color: inherit;
  font-size: 1.3rem;
}
.navItems {
  margin-left: auto;
}
</style>
