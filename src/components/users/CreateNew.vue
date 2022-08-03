<script setup lang="ts">
import { Ref, ref } from "vue";
import CreateUserModal from "./CreateUserModal.vue";

const isOpen: Ref<boolean> = ref(false);
const isCreating: Ref<boolean> = ref(false);

const createUser = () => {
  isOpen.value = false;
  isCreating.value = true;
}
</script>

<template>
  <div class="floating flex flex-col items-end">
    <transition name="slide-fade">
      <div v-if="isOpen" class="mb-5 flex flex-col items-end">
        <div class="overlay" @click="isOpen = false" />
        <button class="new-buttons" @click="createUser()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          {{ $t('users.create') }}
        </button>
       </div>
    </transition>
    <button class="create py-2 px-2" @click="isOpen = !isOpen" :title="$t('users.create')">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>
  </div>
  <CreateUserModal
    v-if="isCreating"
    @close="isCreating = false"
    @save="() => {}"
  />
</template>

<style lang="postcss" scoped>
.floating {
  @apply absolute bottom-6 md:bottom-10 right-6 md:right-10;
}

.create {
  @apply bg-gray-500 hover:bg-gray-700 text-gray-200
      dark:bg-gray-800 dark:hover:bg-gray-900
      border border-gray-200 dark:border-gray-700
      rounded-full shadow-lg z-10;
}

.new-buttons {
  @apply create flex items-center py-3 px-4;
}

.overlay {
  @apply fixed bg-black opacity-0 inset-0 z-0 h-screen w-screen top-0 left-0;
}

/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
