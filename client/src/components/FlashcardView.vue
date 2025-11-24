<template>
  <v-container>
    <v-window v-model="onboarding" show-arrows>
      <v-window-item v-for="(flashcard, i) in flashcards" :key="flashcard.flashcardId" :value="i">
        <div class="text-center">{{ i + 1 }} / {{ flashcards.length }}</div>
        <v-progress-linear color="primary" :model-value="((i+1)/flashcards.length) * 100"></v-progress-linear>
        <v-card
          class="d-flex align-center justify-center"
          elevation="2"
          height="400"
          @click="toggleCard"
          style="cursor: pointer"
        >
          <h1 class="text-h4" v-if="!showDefinition">{{ flashcard.term }}</h1>
          <p class="text-h4" v-else>{{ flashcard.definition }}</p>
        </v-card>
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { Flashcard } from '@/types/types'

defineProps<{
  flashcards: Flashcard[]
}>()

const onboarding = ref<number>(0)
const showDefinition = ref<boolean>(false)

function toggleCard() {
  showDefinition.value = !showDefinition.value
}

// Reset to term side when changing cards
watch(onboarding, () => {
  showDefinition.value = false
})
</script>

<style scoped></style>
