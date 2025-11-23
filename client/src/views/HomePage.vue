<template>
  <div class="homepageNotSignedIn" v-if="userStore.isLoggedOut">
    <h1 class="font-weight-bold text-h2 my-8">The Ultimate Studying Tool</h1>
    <p class="text-h5">Create, study, and manage your flashcards with ease</p>
    <p class="text-h5">Learn faster with spaced repetition</p>
    <v-btn color="primary" class="my-8" to="sign-up">Get Started</v-btn>
    <v-btn variant="outlined" color="primary" class="my-8 mx-2">Find FlashCards</v-btn>
  </div>
  <div v-if="userStore.isLoggedIn">
    <v-container>
      <p class="font-weight-bold text-h2">Hello, {{ capitalizedFirstName() }}</p>
      <ListofCards />
    </v-container>
  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import ListofCards from '@/components/ListOfDecks.vue'
const userStore = useUserStore()

function capitalizedFirstName() {
  const name = userStore.user?.firstName
  return name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : ''
}
</script>
<style scoped>
.homepageNotSignedIn {
  text-align: center;
  margin-top: 100px;
}
</style>
