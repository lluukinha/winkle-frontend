<script setup lang="ts">
import { Ref, ref } from "vue";
import { IPassword } from "../../repositories/passwords/IPassword";
import PasswordStore from "../../store/passwords/PasswordStore";
import CreatePasswordModal from "./CreatePasswordModal.vue";
import CreateFolderModal from "./CreateFolderModal.vue";
import { IFolder } from "../../repositories/folder/IFolder";

const isOpen: Ref<boolean> = ref(false);
const isCreating: Ref<boolean> = ref(false);
const isCreatingFolder: Ref<boolean> = ref(false);

const includePasswordInList = (newPassword: IPassword) => {
  isCreating.value = false;
  PasswordStore.includePasswordInList(newPassword);
};

const includeFolderInList = (newFolder: IFolder) => {
  isCreatingFolder.value = false;
  PasswordStore.includeFolderInList(newFolder);
}

const createPassword = () => {
  isOpen.value = false;
  isCreating.value = true;
}

const createFolder = () => {
  isOpen.value = false;
  isCreatingFolder.value = true;
}
</script>

<template>
  <div class="floating flex flex-col items-end">
    <transition name="slide-fade">
      <div v-if="isOpen" class="mb-5 flex flex-col items-end">
        <div class="overlay" @click="isOpen = false" />
        <button class="new-buttons" @click="createPassword()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          {{ $t('passwords.create') }}
        </button>
        <button class="new-buttons mt-4" @click="createFolder()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          {{ $t('passwords.create-folder') }}
        </button>
       </div>
    </transition>
    <button class="create py-2 px-2" @click="isOpen = !isOpen" :title="$t('passwords.create')">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>
  </div>
  <CreatePasswordModal
    v-if="isCreating"
    @close="isCreating = false"
    @save="includePasswordInList"
  />
  <CreateFolderModal
    v-if="isCreatingFolder"
    @close="isCreatingFolder = false"
    @save="includeFolderInList"
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
