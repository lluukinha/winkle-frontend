<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import DashboardHeader from "../../components/shared/DashboardHeader.vue";
import WinkleScripts from "../../scripts/WinkleScripts";
import NotesStore from "../../store/notes/NotesStore";

import showErrorMessage from "../../scripts/ErrorLogs";
import Notepad from "../../components/notes/Notepad.vue";
import { INote } from "../../repositories/notes/INote";

const emptyNote = { id: '', note: '' };
const notepad = ref();
const chosenNote: Ref<INote> = ref(emptyNote);

const createNote = (note: INote) => NotesStore.createNote(note).then((result: INote) => loadNote(result)).catch(showErrorMessage);
const updateNote = (note: INote) => NotesStore.updateNote(note).catch(showErrorMessage);
const removeNote = (noteId: string) => NotesStore.removeNote(noteId).then((result: INote) => loadNote(result)).catch(showErrorMessage);

const noteUpdated = (note: INote) => {
  if (note.id === '') createNote(note);
  if (note.id !== '') updateNote(note);
};

const loadNote = (note: INote) => {
  chosenNote.value = note;
  notepad.value.loadNote(note);
  isShowingList.value = false;
}

const noteTitle = (title: string) => {
  const newTitle = title.split('\n').filter(n => n.trim().length > 0)[0].substring(0, 20);
  if (newTitle.length === 20) return `${newTitle}...`;
  return newTitle;
};

const isShowingList: Ref<boolean> = ref(true);

const backToList = () => {
  isShowingList.value = true;
}

onMounted(() => {
  if (!NotesStore.listIsLoaded.value) NotesStore.loadNotes().catch(showErrorMessage);
});
</script>

<template>
  <DashboardHeader :title="$t('notes.title')" />
  <div class="flex">
    <div
      class="bg-gray-400 dark:bg-gray-800 w-screen md:w-80 h-screen pt-20 md:pt-0"
      v-show="WinkleScripts.deviceType() == 'mobile' && isShowingList || WinkleScripts.deviceType() !== 'mobile'">
      <ul class="mt-4 px-4">
        <li
          class="note-li"
          :class="{ 'chosen-note': chosenNote.id === '' }"
          @click="loadNote(emptyNote)"
        >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        {{ $t('notes.create') }}
      </li>
      <li
        v-for="note in NotesStore.notes.value"
        :key="note.id"
        class="note-li"
        :class="{ 'chosen-note': chosenNote?.id === note.id }"
        @click="loadNote(note)"
      >
        {{ noteTitle(note.note) }}
      </li>
    </ul>
  </div>
  <div
    class="px-4 md:px-8 md:pb-0 pt-20 md:pt-2 h-screen md:h-[93vh] overflow-hidden w-full"
    v-show="WinkleScripts.deviceType() == 'mobile' && !isShowingList || WinkleScripts.deviceType() !== 'mobile'"
  >
    <Notepad
      ref="notepad"
      class="h-screen"
      @save="noteUpdated"
      @remove="removeNote"
      @back="backToList"
      :note="chosenNote"
    />
  </div>
  </div>
</template>

<style lang="postcss" scoped>
.note-li {
  @apply flex justify-start items-center w-full mb-2 rounded-md py-2 px-6 cursor-pointer text-black dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600;
}

.chosen-note {
  @apply bg-gray-300 dark:text-white dark:bg-gray-700;
}
</style>
