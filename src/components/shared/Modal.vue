<script setup lang="ts">
import WinkleScripts from '../../scripts/WinkleScripts';
import WinkleButton from './WinkleButton.vue';
defineProps<{
  removeSave?: boolean,
  saveLabel?: string,
  size?: string,
  saveDisabled?: boolean
}>();
const emit = defineEmits(['close', 'save']);
const handleClose = () => { emit('close'); }
const handleSave = () => { emit('save'); }
</script>

<template>
  <div
    class="
      min-w-screen
      h-screen
      animated
      fadeIn
      faster
      fixed
      left-0
      top-0
      flex
      justify-center
      items-center
      inset-0
      z-50
      outline-none
      focus:outline-none
      bg-no-repeat bg-center bg-cover
    "
  >
    <div class="absolute bg-black opacity-80 inset-0 z-0"></div>
    <div
      :class="size || 'md:max-w-xl'"
      class="
        w-full
        p-4
        relative
        mx-auto
        my-40
        rounded
        shadow-lg
        bg-white dark:bg-gray-700 dark:text-gray-200
        max-h-[calc(100vh-2rem)]
      "
    >
      <!--content-->
      <div class="">
        <!--body-->
        <div class="text-center p-2 flex-auto justify-center overflow-y-auto max-h-[70vh]">
          <slot></slot>
        </div>
        <!--footer-->
        <div
          class="p-3 mt-2"
          :class="!removeSave ? 'flex justify-between w-full' : ''"
        >
          <WinkleButton :rounded="true" @click="handleClose()">
            {{ $t('close') }}
          </WinkleButton>
          <WinkleButton
            :rounded="true"
            type="success"
            @click="handleSave()"
            v-if="!removeSave"
            :disabled="saveDisabled || WinkleScripts.isLoading.value"
          >
            {{ saveLabel ? saveLabel : $t('save') }}
          </WinkleButton>
        </div>
      </div>
    </div>
  </div>
</template>