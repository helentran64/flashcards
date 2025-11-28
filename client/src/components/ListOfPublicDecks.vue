<template>
  <v-container>
    <v-text-field
      label="Search"
      variant="outlined"
      density="compact"
      prepend-inner-icon="mdi-magnify"
      v-model="searchedDeck"
      clearable
    />
    <v-row class="my-8">
      <v-col v-for="deck in filteredDecks" :key="deck.deckId" cols="12" sm="6" md="4" lg="3">
        <v-card height="180px">
          <router-link :to="`/deck/${deck.deckId}`" style="text-decoration: none; color: inherit">
            <v-card-title class="font-weight-bold">{{ deck.title }}</v-card-title>
            <v-card-subtitle>
              Created on: {{ new Date(deck.creation).toLocaleDateString() }}
            </v-card-subtitle>
            <v-card-text>By: {{ deck.username }}</v-card-text>
          </router-link>
          <v-card-actions v-if="userStore.user?.username !== deck.username">
            <v-btn icon="mdi-plus" color="green" @click="addToPersonal(deck.title)"></v-btn
          ></v-card-actions>
        </v-card>
      </v-col>
      <v-col v-if="filteredDecks.length === 0" cols="12" class="text-center">
        <p class="text-h6 text-grey">No decks found</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api'
import type { Deck } from '@/types/types'
import { useUserStore } from '@/stores/userStore'

const searchedDeck = ref<string>('')
const publicDecks = ref<Array<Deck>>([])
const userStore = useUserStore()

const filteredDecks = computed(() => {
  if (!searchedDeck.value) {
    return publicDecks.value
  }

  const searchTerm = searchedDeck.value.toLowerCase().trim()
  return publicDecks.value.filter((deck) => deck.title.toLowerCase().includes(searchTerm))
})

onMounted(async () => {
  try {
    const res = await api.get(`/deck/get_all_public_decks`)
    if (res.data && res.data.success) {
      publicDecks.value = res.data.data
    }
  } catch (error) {
    console.error('Error loading public decks:', error)
  }
})

async function addToPersonal(title: string) {
  try {
    await api.post('/deck/create', {
      title: title,
      isPrivate: true,
      username: userStore.user?.username,
      copied: true,
    })
  } catch (err) {
    console.error('Error adding to personal decks', err)
  }
}
</script>
