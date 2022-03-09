<script setup lang="ts">
import { ref, Ref } from 'vue';
import { IFolder } from '../../repositories/folder/IFolder';
import PasswordRepository from '../../repositories/passwords/PasswordRepository';
import showErrorMessage from '../../scripts/ErrorLogs';
import i18n from '../../scripts/internacionalization/i18n';
import { showError } from '../../scripts/NotificationScript';
import WinkleScripts from '../../scripts/WinkleScripts';
import PasswordStore from '../../store/passwords/PasswordStore';
import RemoveIcon from '../icons/RemoveIcon.vue';

const props = defineProps<{ isOpen: boolean, name: string, count: number, folderId?: string }>();
const emit = defineEmits(['toggle']);

const { t } = i18n.element.global;
const isEditing: Ref<boolean> = ref(false);
const folderName: Ref<string> = ref(props.name);
const editInput: Ref<HTMLElement | undefined> = ref();

const allowEditing = () => {
  isEditing.value = true;
  setTimeout(() => { editInput.value?.focus(); }, 10);
};

const hasErrors = () : boolean => {
  const newName = folderName.value.trim().toUpperCase();

  if (newName === '') {
    folderName.value = props.name;
    isEditing.value = false;
    return true;
  }

  if (newName === props.name) {
    isEditing.value = false;
    return true;
  }

  const folderNames = PasswordStore.foldersList.value
    .filter(f => f.id !== props.folderId)
    .map(f => f.name);

  if (folderNames.includes(newName)) {
    showError(
      t('api-errors.title'),
      t('passwords.folder-form.errors.already-exists')
    );
    return true;
  }

  return false;
}

const updateFolder = (e: Event) => {
  e.preventDefault();
  if (hasErrors() || !props.folderId) return;

  const newName = folderName.value.trim().toUpperCase();
  WinkleScripts.setLoading(true);
  PasswordRepository.updateFolder(props.folderId, newName)
    .then((folder: IFolder) => {
      PasswordStore.changeFolderInList(folder);
      isEditing.value = false;
    })
    .catch(showErrorMessage)
    .finally(() => { WinkleScripts.setLoading(false); })
}
</script>

<template>
  <div class="main">
    <div class="flex items-center">
      <svg @click="$emit('toggle')" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path v-if="!isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>

      <template v-if="!isEditing">
        <span class="ml-2" @click="$emit('toggle')">
          {{ name }} ({{ count }})
        </span>

        <div class="ml-2 text-gray-400" @click="allowEditing()" v-if="folderId">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
      </template>

      <form v-else class="flex items-center" @submit="updateFolder">
        <input
          ref="editInput"
          v-model="folderName"
          class="
            px-2 uppercase mr-2
            bg-gray-300 dark:bg-gray-700
            border-b border-gray-500"
        />
        <button type="submit" class="text-green-500 hover:text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </form>
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
