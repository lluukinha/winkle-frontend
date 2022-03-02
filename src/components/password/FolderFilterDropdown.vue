<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";
import { IFolder } from "../../repositories/passwords/IFolder";
import WinkleButton from "../shared/WinkleButton.vue";

const props = defineProps<{ folders: IFolder[], selectedIds: string[] }>();
defineEmits(['close', 'save']);

const selectedFolderIds: Ref<string[]> = ref([]);

onMounted(() => {
  selectedFolderIds.value = [ ...props.selectedIds ];
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
    selectedFolderIds.value = [ ...props.folders.map(f => f.id) ];
    return;
  }
  selectedFolderIds.value = [];
};
</script>

<template>
  <div class="absolute bg-black opacity-30 inset-0 z-0" @click="$emit('close')"></div>
  <div class="fixed mt-10 bg-gray-50 rounded p-4 shadow-lg">
    <ul class="max-h-[40vh] max-w-[calc(100vw-60px)] md:max-w-64 overflow-auto px-4">
      <li
        class="text-left border-b-2 p-2 hover:bg-gray-200 cursor-pointer"
        @click="showAll()"
      >
        <input
          type="checkbox"
          :checked="selectedFolderIds.length === 0"
        /> {{ $t('passwords.folder-filter.show-all') }}
      </li>
      <li
        v-for="folder in folders"
        :key="folder.id"
        class="text-left border-b-2 p-2 hover:bg-gray-200 cursor-pointer"
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