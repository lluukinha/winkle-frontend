<script setup lang="ts">
import { computed } from "@vue/runtime-core";

type ButtonType = 'success' | 'warning' | 'error' | 'info' | 'default';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
const props = defineProps<{
  type?: ButtonType,
  disabled?: boolean,
  size?: ButtonSize,
  rounded?: boolean
}>();

const buttonClass = computed(() => {
  const classTypes = {
    success: 'bg-green-600 border border-green-500 hover:bg-green-700 text-white',
    warning: 'bg-yellow-500 border border-yellow-400 hover:bg-yellow-600 text-white text-shadow',
    error: 'bg-red-600 border border-red-500 hover:bg-red-700 text-white',
    info: 'bg-indigo-500 border border-indigo-400 hover:bg-indigo-600 text-white',
    default: 'bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-800',
  };

  if (!props.type) return classTypes['default'];
  return classTypes[props.type];
});

const buttonSize = computed(() => {
  if (!props.size) return 'text-sm';
  return `text-${props.size}`;
});

const click = () => { if (!props.disabled) emit('click'); }
const emit = defineEmits(['click']);
defineExpose({ click });
</script>

<template>
  <button
    :class="`${buttonClass} ${buttonSize} ${rounded ? 'rounded-md' : 'rounded'}`"
    class="
      mb-2 md:mb-0
      px-5 py-2
      shadow-sm
      font-medium tracking-wider
      disabled:opacity-50
    "
    :disabled="disabled"
    @click="click()"
  >
    <slot></slot>
  </button>
</template>
