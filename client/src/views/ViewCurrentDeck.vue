<template>
  <v-container>
    <p class="font-weight-bold text-h3 my-4">{{ deckTitle }}</p>
    <v-btn color="green" v-if="!startedStudying" @click="toggleStudying" class="mb-4" prepend-icon="mdi-play"
      >Start Studying</v-btn
    >
    <v-btn color="red" v-if="startedStudying" @click="toggleStudying" class="mb-4" prepend-icon="mdi-stop"
      >End Session</v-btn
    >
    <div v-show="startedStudying">
      <FlashCardView :flashcards="flashcards" />
    </div>
    <div v-show="!startedStudying">
      <v-sheet v-for="flashcard in flashcards" :key="flashcard.flashcardId" class="my-4" elevation="2">
        <v-container>
          <v-text-field
            label="term"
            density="compact"
            variant="outlined"
            :modelValue="flashcard.term"
            readonly
          />
          <v-textarea
            label="definition"
            density="compact"
            variant="outlined"
            :modelValue="flashcard.definition"
            readonly
          />
          <v-btn icon="mdi-pencil-outline" @click="openEditModal(flashcard)" />
          <v-btn icon="mdi-trash-can-outline" @click="deleteFlashcard(flashcard.flashcardId)" />
        </v-container>
      </v-sheet>
      <!-- Default box to add new card -->
      <v-sheet elevation="2">
        <v-container>
          <v-text-field label="term" density="compact" variant="outlined" v-model="newTerm" />
          <v-textarea label="definition" density="compact" variant="outlined" v-model="newDef" />
          <v-btn color="green" @click="addFlashcard">Add Card</v-btn>
        </v-container>
      </v-sheet>

      <!-- Edit Modal -->
      <v-dialog v-model="editDialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Edit Flashcard</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field label="Term" density="compact" variant="outlined" v-model="editTerm" />
              <v-textarea
                label="Definition"
                density="compact"
                variant="outlined"
                v-model="editDefinition"
              />
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="closeEditModal"> Cancel </v-btn>
            <v-btn color="primary" variant="text" @click="saveFlashcard"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import api from '@/api'
import FlashCardView from '@/components/FlashcardView.vue'
import type { Flashcard } from '@/types/types'

const deckTitle = ref<string>('')
const deckId = ref<number | null>(null)
const newTerm = ref<string>('')
const newDef = ref<string>('')
const userStore = useUserStore()
const flashcards = ref<Array<Flashcard>>([])
const startedStudying = ref<boolean>(false)

// Edit modal state
const editDialog = ref<boolean>(false)
const editFlashcardId = ref<number | null>(null)
const editTerm = ref<string>('')
const editDefinition = ref<string>('')

const route = useRoute()

onMounted(() => {
  getDeckId()
  getDeckTitle()
  getFlashcards()
})

function toggleStudying() {
  startedStudying.value = !startedStudying.value
}

function getDeckId() {
  const param = route.params.deckId
  if (typeof param === 'string') {
    deckId.value = parseInt(param)
  } else if (Array.isArray(param) && typeof param[0] === 'string') {
    deckId.value = parseInt(param[0])
  } else {
    deckId.value = null
  }
}

async function getDeckTitle() {
  if (deckId.value === null) return
  try {
    const response = await api.get(`/deck/get_title_by_deckId/${deckId.value}`)
    if (response.data && response.data.success) {
      deckTitle.value = response.data.data.title
    } else {
      console.error('Failed to fetch deck title')
    }
  } catch (error) {
    console.error('Error fetching deck title:', error)
  }
}

async function addFlashcard() {
  if (deckId.value === null) return
  try {
    const response = await api.post('/flashcard/create', {
      term: newTerm.value,
      definition: newDef.value,
      deckId: deckId.value,
      username: userStore.user?.username,
    })
    if (response.data && response.data.success) {
      getFlashcards()
      newTerm.value = ''
      newDef.value = ''
    }
  } catch (error) {
    console.error('Error adding flashcard:', error)
  }
}

async function getFlashcards() {
  if (deckId.value === null) return
  try {
    const response = await api.get(`/flashcard/get_by_deckId/${deckId.value}`)
    if (response.data && response.data.success) {
      flashcards.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching flashcards:', error)
  }
}

function openEditModal(flashcard: Flashcard) {
  editFlashcardId.value = flashcard.flashcardId
  editTerm.value = flashcard.term
  editDefinition.value = flashcard.definition
  editDialog.value = true
}

function closeEditModal() {
  editDialog.value = false
  editFlashcardId.value = null
  editTerm.value = ''
  editDefinition.value = ''
}

async function saveFlashcard() {
  if (editFlashcardId.value === null) return
  try {
    const response = await api.put(`/flashcard/update/${editFlashcardId.value}`, {
      term: editTerm.value,
      definition: editDefinition.value,
    })
    if (response.data && response.data.success) {
      await getFlashcards()
      closeEditModal()
    } else {
      console.error('Failed to update flashcard')
    }
  } catch (error) {
    console.error('Error updating flashcard:', error)
  }
}

async function deleteFlashcard(flashcardId: number) {
  try {
    const response = await api.delete(`/flashcard/delete/${flashcardId}`)
    if (response.data && response.data.success) {
      flashcards.value = flashcards.value.filter(
        (flashcard) => flashcard.flashcardId !== flashcardId,
      )
      await getFlashcards()
    } else {
      console.error('Failed to delete flashcard')
    }
  } catch (error) {
    console.error('Error deleting flashcard:', error)
  }
}
</script>

<style scoped></style>
