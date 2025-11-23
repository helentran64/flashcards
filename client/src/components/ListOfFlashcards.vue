<template>
  <v-container>
    <v-row class="my-8">
      <v-col cols="12" sm="6" md="4" lg="3">
        <v-card
          variant="tonal"
          color="primary"
          height="150px"
          class="d-flex align-center justify-center"
          @click="showAddDeckModal = true"
        >
          <v-card-item
            ><span><v-icon icon="mdi-plus" class="mr-2"></v-icon></span>Click here to add
            deck</v-card-item
          >
        </v-card>
      </v-col>

      <v-col v-for="deck in decks" :key="deck.deckId" cols="12" sm="6" md="4" lg="3">
        <v-card height="150px">
          <v-card-title class="font-weight-bold">{{ deck.title }}</v-card-title>
          <v-card-subtitle>
            Created on: {{ new Date(deck.creation).toLocaleDateString() }}
          </v-card-subtitle>
          <v-card-text>{{ deck.privacy ? 'Public' : 'Private' }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- Add Deck Modal -->
    <v-dialog v-model="showAddDeckModal" persistent max-width="700px">
      <v-card>
        <v-card-title>Create a new deck</v-card-title>
        <v-card-text>
          <v-text-field
            label="Deck Title"
            variant="outlined"
            density="compact"
            v-model="deckTitle"
          />
          <v-switch label="Private" v-model="isPrivate" color="primary" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="tonal" color="red" @click="onCancel">Cancel</v-btn>
          <v-btn variant="tonal" color="primary" @click="createDeck">Create Deck</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import api from '@/api'

type Deck = {
  deckId: number
  title: string
  privacy: boolean
  username: string
  creation: Date
}

const userStore = useUserStore()
const decks = ref<Array<Deck>>([])
const showAddDeckModal = ref<boolean>(false)

const deckTitle = ref<string>('')
const isPrivate = ref<boolean>(true)

async function loadDecks() {
  try {
    const res = await api.get(`/deck/get_by_username/${userStore.user?.username}`)
    if (res.data && res.data.success) {
      decks.value = res.data.data
    }
  } catch (error) {
    console.error('Error fetching decks:', error)
  }
}

onMounted(() => {
  loadDecks()
})

function resetForm() {
  deckTitle.value = ''
  isPrivate.value = true
}

function onCancel() {
  resetForm()
  showAddDeckModal.value = false
}

async function createDeck() {
  try {
    const res = await api.post('/deck/create', {
      title: deckTitle.value,
      isPrivate: isPrivate.value,
      username: userStore.user?.username,
    })
    if (res.data && res.data.success) {
      // Close modal, reset form and reload decks
      showAddDeckModal.value = false
      resetForm()
      await loadDecks()
    }
  } catch (error) {
    console.error('Error creating deck:', error)
  }
}
</script>
<style scoped></style>
