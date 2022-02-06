<script setup lang="ts">
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
      class="
        w-full
        max-w-lg
        p-4
        relative
        mx-auto
        my-auto
        rounded-xl
        shadow-lg
        bg-white
      "
    >
      <!--content-->
      <div class="">
        <!--body-->
        <div class="text-center p-2 flex-auto justify-center">
          <slot></slot>
        </div>
        <!--footer-->
        <div class="p-3 mt-2 text-center space-x-4 md:block">
          <button
            class="
              mb-2
              md:mb-0
              bg-white
              px-5
              py-2
              text-sm
              shadow-sm
              font-medium
              tracking-wider
              border
              text-gray-600
              rounded-full
              hover:shadow-lg hover:bg-gray-100
            "
            @click="handleClose()"
          >
            {{ $t('cancel') }}
          </button>
          <button
            class="
              mb-2
              md:mb-0
              bg-green-600
              border border-green-500
              px-5
              py-2
              text-sm
              shadow-sm
              font-medium
              tracking-wider
              text-white
              rounded-full
              hover:shadow-lg hover:bg-green-700
            "
            @click="handleSave()"
          >
            {{ $t('save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>