<script setup lang="ts">
import PasswordStore from '../../store/passwords/PasswordStore';
import RemoveIcon from '../icons/RemoveIcon.vue';

defineProps<{ isOpen: boolean, name: string, count: number, folderId?: string }>();
defineEmits(['toggle']);
</script>

<template>
  <div class="main">
    <div class="flex items-center" @click="$emit('toggle')">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path v-if="!isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
      <span class="ml-2">
        {{ name }} ({{ count }})
      </span>
    </div>

    <button
      class="remove-button"
      @click="PasswordStore.removeFolder(Number(folderId))"
      :title="$t('passwords.remove')"
      v-if="count === 0 && folderId"
    >
      <RemoveIcon />
    </button>
  </div>
</template>

<style lang="postcss" scoped>
.main {
  @apply border-b border-gray-400 dark:border-gray-600
         w-full pb-2
         text-left uppercase select-none cursor-pointer
         dark:text-gray-100
         flex justify-between items-center;
}

.remove-button {
  @apply py-2 px-3
         text-xs leading-3
         text-red-700
         dark:text-red-300 hover:text-red-500
         rounded-full flex items-center;
}
</style>
