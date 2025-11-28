<template>
  <v-dialog :model-value="isOpen" @update:model-value="closeModal" max-width="500">
    <v-card>
      <v-card-title class="text-h5">Confirm Deletion</v-card-title>
      <v-card-text>
        Are you sure you want to delete this item? This action cannot be undone.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="closeModal">Cancel</v-btn>
        <v-btn color="red" variant="text" @click="confirmDeletion">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const closeModal = () => {
  emit('close')
}

const confirmDeletion = () => {
  emit('confirm')
  emit('close')
}
</script>

<style scoped></style>
