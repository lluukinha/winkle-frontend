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
    success: `
      bg-green-600 hover:bg-green-700
      border border-green-500
      text-white`,
    warning: `
      bg-yellow-500 hover:bg-yellow-600
      border border-yellow-400
      text-white text-shadow`,
    error: `
      bg-red-600 hover:bg-red-700
      border border-red-500
      text-white`,
    info: `
      bg-indigo-500 dark:bg-indigo-900
      border border-indigo-400 dark:border-indigo-700
      hover:bg-indigo-600
      text-white`,
    default: `
      bg-gray-100 dark:bg-gray-600
      border border-gray-300 dark:border-gray-600
      hover:bg-gray-200 dark:hover:bg-gray-700
      text-gray-800 dark:text-gray-200`,
  };

  if (!props.type) return classTypes['default'];
  return classTypes[props.type];
});

const sizeClass = computed(() => {
  const classTypes = {
    xs: 'px-2 py-1',
    sm: 'px-3 py-2',
    md: 'px-5 py-2',
    lg: 'px-5 py-2',
    xl: 'px-5 py-2',
    '2xl': 'px-5 py-2',
    '3xl': 'px-5 py-2',
  };

  if (!props.size) return classTypes.md;
  return classTypes[props.size];
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
    :class="`${buttonClass} ${sizeClass} ${buttonSize} ${rounded ? 'rounded-md' : 'rounded'}`"
    class="
      shadow-sm
      font-medium tracking-wider
      disabled:opacity-50
      text-center
    "
    :disabled="disabled"
    @click="click()"
  >
    <slot></slot>
  </button>
</template>
