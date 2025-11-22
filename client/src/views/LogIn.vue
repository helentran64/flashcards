<template>
  <v-container>
    <v-card class="px-6 py-8 text-center mx-auto rounded" max-width="400">
      <h2 class="font-weight-bold mb-6">Login</h2>
      <v-text-field
        label="Username"
        variant="outlined"
        :rules="[required]"
        density="compact"
      ></v-text-field>
      <v-text-field
        label="Password"
        variant="outlined"
        type="password"
        :rules="[required]"
        density="compact"
      ></v-text-field>
      <v-btn color="primary" class="mt-4" block>Login</v-btn>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
function required(v: string) {
  return !!v || 'Field is required'
}
</script>
