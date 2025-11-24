<template>
  <v-container>
    <v-row class="my-8">
      <v-col cols="12" sm="6" md="4" lg="3">
        <v-card
          variant="tonal"
          color="primary"
          height="180px"
          class="d-flex align-center justify-center"
          @click="openCreateModal"
        >
          <v-card-item
            ><span><v-icon icon="mdi-plus" class="mr-2"></v-icon></span>Click here to add
            deck</v-card-item
          >
        </v-card>
      </v-col>

      <v-col v-for="deck in decks" :key="deck.deckId" cols="12" sm="6" md="4" lg="3">
        <v-card height="180px">
          <router-link :to="`/deck/${deck.deckId}`" style="text-decoration: none; color: inherit">
            <v-card-title class="font-weight-bold">{{ deck.title }}</v-card-title>
            <v-card-subtitle>
              Created on: {{ new Date(deck.creation).toLocaleDateString() }}
            </v-card-subtitle>
            <v-card-text>{{ deck.privacy ? 'Private' : 'Public' }}</v-card-text>
          </router-link>
          <v-card-actions>
            <v-btn icon="mdi-trash-can-outline" @click="openDeleteModal(deck.deckId)" />
            <v-btn icon="mdi-pencil-outline" @click="openEditModal(deck)" />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Deck Modal (Create/Edit) -->
    <v-dialog v-model="showDeckModal" persistent max-width="700px">
      <v-card>
        <v-card-title>{{ isEditMode ? 'Edit Deck' : 'Create a new deck' }}</v-card-title>
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
          <v-btn variant="tonal" color="primary" @click="saveDeck">
            {{ isEditMode ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Modal -->
    <DeleteModal
      :isOpen="showDeleteModal"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import api from '@/api'
import type { Deck } from '@/types/types'
import DeleteModal from '@/components/Modals/DeleteModal.vue'

const userStore = useUserStore()
const decks = ref<Array<Deck>>([])
const showDeckModal = ref<boolean>(false)
const isEditMode = ref<boolean>(false)
const currentDeckId = ref<number | null>(null)

const deckTitle = ref<string>('')
const isPrivate = ref<boolean>(true)

// Delete modal state
const showDeleteModal = ref<boolean>(false)
const deckToDelete = ref<number | null>(null)

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
  currentDeckId.value = null
  isEditMode.value = false
}

function openCreateModal() {
  resetForm()
  showDeckModal.value = true
}

function openEditModal(deck: Deck) {
  isEditMode.value = true
  currentDeckId.value = deck.deckId
  deckTitle.value = deck.title
  isPrivate.value = deck.privacy
  showDeckModal.value = true
}

function onCancel() {
  resetForm()
  showDeckModal.value = false
}

async function saveDeck() {
  if (isEditMode.value) {
    await updateDeck()
  } else {
    await createDeck()
  }
}

async function createDeck() {
  try {
    const res = await api.post('/deck/create', {
      title: deckTitle.value,
      isPrivate: isPrivate.value,
      username: userStore.user?.username,
    })
    if (res.data && res.data.success) {
      showDeckModal.value = false
      resetForm()
      await loadDecks()
    }
  } catch (error) {
    console.error('Error creating deck:', error)
  }
}

async function updateDeck() {
  try {
    const res = await api.put(`/deck/update/${currentDeckId.value}`, {
      title: deckTitle.value,
      isPrivate: isPrivate.value,
    })
    if (res.data && res.data.success) {
      showDeckModal.value = false
      resetForm()
      await loadDecks()
    }
  } catch (error) {
    console.error('Error updating deck:', error)
  }
}

function openDeleteModal(deckId: number) {
  deckToDelete.value = deckId
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (deckToDelete.value === null) return

  try {
    const res = await api.delete(`/deck/delete/${deckToDelete.value}`)
    if (res.data && res.data.success) {
      decks.value = decks.value.filter((deck) => deck.deckId !== deckToDelete.value)
      deckToDelete.value = null
    }
  } catch (error) {
    console.error('Error deleting deck:', error)
  }
}
</script>

<style scoped></style>
