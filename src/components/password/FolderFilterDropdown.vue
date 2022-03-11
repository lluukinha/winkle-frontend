<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";
import { IFolder } from "../../repositories/folder/IFolder";
import PasswordStore from "../../store/passwords/PasswordStore";
import WinkleButton from "../shared/WinkleButton.vue";

defineEmits(['close', 'save']);

const selectedFolderIds: Ref<string[]> = ref([]);

onMounted(() => {
  selectedFolderIds.value = [ ...PasswordStore.selectedFolderIds.value ];
});

const selectFolder = (folderId: string) => {
  if (selectedFolderIds.value.includes(folderId)) {
    const index = selectedFolderIds.value.findIndex(id => id === folderId);
    selectedFolderIds.value.splice(index, 1);
    return;
  }

  selectedFolderIds.value.push(folderId);
};

const showAll = () => {
  if (selectedFolderIds.value.length === 0) {
    const folderIds: string[] = PasswordStore.foldersList.value.map(f => f.id);
    selectedFolderIds.value = [ ...folderIds ];
    return;
  }
  selectedFolderIds.value = [];
};
</script>

<template>
  <div
    class="absolute bg-black opacity-30 inset-0 z-0"
    @click="$emit('close')"
  />
  <div
    class="
      fixed top-32
      rounded p-4 shadow-lg
      bg-gray-50 dark:bg-gray-700"
  >
    <ul class="max-h-[60vh] max-w-[calc(100vw-60px)] md:max-w-64 overflow-auto px-4">
      <li @click="showAll()">
        <input
          type="checkbox"
          :checked="selectedFolderIds.length === 0"
        /> {{ $t('passwords.folder-filter.show-all') }}
      </li>
      <li @click="selectFolder('0')">
        <input
          type="checkbox"
          :checked="selectedFolderIds.includes('0')"
        /> {{ $t('passwords.without-folder') }}
      </li>
      <li
        v-for="folder in PasswordStore.foldersList.value"
        :key="folder.id"
        @click="selectFolder(folder.id)"
      >
        <input
          type="checkbox"
          :checked="selectedFolderIds.includes(folder.id)"
        /> {{ folder.name }}
      </li>
    </ul>
    <div class="mt-4 flex w-full justify-end">
      <WinkleButton
        @click="$emit('close')"
        size="xs"
        class="mr-4"
      >
        {{ $t('passwords.folder-filter.cancel') }}
      </WinkleButton>
      <WinkleButton
        type="success"
        size="xs"
        @click="$emit('save', selectedFolderIds)"
      >
        {{ $t('passwords.folder-filter.save') }}
      </WinkleButton>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
li {
  @apply  text-left border-b-2 p-2
          dark:text-gray-100 dark:border-gray-600
        hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer;
}
</style>