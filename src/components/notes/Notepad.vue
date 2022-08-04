<script setup lang="ts">
import { computed, PropType, Ref, ref, onMounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { INote } from '../../repositories/notes/INote';
import i18n from '../../scripts/internacionalization/i18n';
import WinkleScripts from '../../scripts/WinkleScripts';

const { t } = i18n.element.global;
const emptyNote = { id: '', note: '' };
const props = defineProps({ note: Object as PropType<INote> });
const emit = defineEmits(['save', 'remove', 'back']);
const winkleNote : Ref<INote> = ref(emptyNote);
const words = computed(() => winkleNote.value.note.split('\n').join(' ').split(' ').filter(a => a.length > 0).length);
onBeforeRouteLeave(async () => saveNote);

const saveNote = () => {
  const isCreating = winkleNote.value.id === '';
  const isDifferentToUpdate = props.note && props.note.note != winkleNote.value.note;
  const hasText = winkleNote.value.note.split('\n').join('').trim().length > 0;
  if (hasText && (isCreating || isDifferentToUpdate)) emit('save', winkleNote.value);
  if (!hasText && isDifferentToUpdate) {
    emit('remove', winkleNote.value.id);
    winkleNote.value = emptyNote;
  }
};

const loadNote = (note: INote) => {
  winkleNote.value = { ...note };
  notepad.value.focus();
};

const removeNote = async (noteId: string) => {
    const result = await confirm(t('notes.confirm-delete'));
    if (result) emit('remove', noteId);
};

const notepad = ref();

onMounted(() => {
  if (props.note) winkleNote.value = props.note;
});

defineExpose({ loadNote });
</script>

<template>
  <div class="relative p-0 m-auto h-full">
    <textarea
      class="
        h-full w-full
        text-2xl
        outline-hidden shadow-none resize-none p-4
        border-none focus:outline-none
        bg-gray-300 dark:bg-gray-700
      "
      @blur="saveNote"
      v-model="winkleNote.note"
      :placeholder="$t('notes.notepad-placeholder')"
      ref="notepad"
      autofocus
    ></textarea>
    <div
      class="absolute bottom-3 m-auto py-1 text-gray-700 dark:text-white bg-gray-300 dark:bg-gray-700 flex items-center justify-between w-full"
    >
      <div>
        <button @click="$emit('back')" v-if="WinkleScripts.deviceType() === 'mobile'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <div>{{ words }} {{ $t('notes.words') }}</div>
      <div>
        <button @click="removeNote(winkleNote.id)" v-if="winkleNote.id !== ''">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
    <!-- div
      class="absolute bg-blue-400 bottom-3 left-0 ml-auto py-1 px-3 rounded-2xl text-gray-700 gap-3 flex justify-between"
      @click="$emit('back')"
    >
      <p>voltar</p>
    </div>
    <div class="word-count-container flex items-center">
      <p>{{ words }} word(s)</p>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" @click="$emit('remove', winkleNote.id)" v-if="winkleNote.id !== ''">
        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    </div -->
  </div>
</template>

<style lang="postcss">
.word-count-container {
  position: absolute;
  display: inline-block;
  background: #e0ceff;
  bottom: 12px;
  right: 0;
  margin-left: auto;
  margin-right: 3%;
  padding: 5px 14px;
  border-radius: 20px;
  color: #403333;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  gap: 14px;
}

.word-count-container p {
  margin: 0;
}
</style>