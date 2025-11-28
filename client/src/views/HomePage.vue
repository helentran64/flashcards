<template>
  <div class="homepageNotSignedIn" v-if="userStore.isLoggedOut">
    <h1 class="font-weight-bold text-h2 my-8">The Ultimate Studying Tool</h1>
    <p class="text-h5">Create, study, and manage your flashcards with ease</p>
    <p class="text-h5">Learn faster with spaced repetition</p>
    <v-btn color="primary" class="my-8" to="sign-up">Get Started</v-btn>
    <v-btn variant="outlined" color="primary" to="all-public-decks" class="my-8 mx-2">Find FlashCards</v-btn>
  </div>
  <div v-if="userStore.isLoggedIn">
    <v-container>
      <p class="font-weight-bold text-h2">Welcome, {{ capitalizedFirstName() }}</p>
      <v-tabs
        v-model="tab"
        :items="tabs"
        color="white"
        height="60"
        slider-color="#f78166"
        class="my-4"
      >
        <template v-slot:tab="{ item }">
          <v-tab :prepend-icon="item.icon" :text="item.text" :value="item.value" />
        </template>
        <template v-slot:item="{ item }">
          <v-tabs-window-item :value="item.value" class="pa-4">
            <ListOfDecks v-if="item.value === 'tab-1'" ref="myDecksRef" />
            <ListOfPublicDecks v-else-if="item.value === 'tab-2'" />
          </v-tabs-window-item>
        </template>
      </v-tabs>
    </v-container>
  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import ListOfDecks from '@/components/ListOfDecks.vue'
import ListOfPublicDecks from '@/components/ListOfPublicDecks.vue'
import { shallowRef, watch, ref } from 'vue'

const userStore = useUserStore()

const tab = shallowRef('tab-1')
const myDecksRef = ref<InstanceType<typeof ListOfDecks> | null>(null)

const tabs = [
  { text: 'My Decks', icon: 'mdi-book-multiple', value: 'tab-1' },
  { text: 'Public Decks', icon: 'mdi-earth', value: 'tab-2' },
]

// Watch for tab changes and refresh My Decks
watch(tab, (newTab) => {
  if (newTab === 'tab-1' && myDecksRef.value) {
    myDecksRef.value.loadDecks()
  }
})

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