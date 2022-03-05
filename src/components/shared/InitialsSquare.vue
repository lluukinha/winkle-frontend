<script setup lang="ts">
import { computed } from "vue";
type ClassSize = 'sm' | 'md' | 'lg';
const props = defineProps<{
  text: string;
  customClass?: string;
  bgClass?: string;
  size?: ClassSize;
}>();

const initials = computed(() => {
  const words = props.text.split(' ');
  const lastIndex = words.length - 1;
  if (lastIndex === 0) return words[0].charAt(0);
  return `${words[0].charAt(0)}${words[lastIndex].charAt(0)}`.toUpperCase();
});

const circleClass = computed(() => {
  const sizeClass = {
    sm: 'w-12 h-12 text-lg shadow-md',
    md: 'w-14 h-14 text-3xl shadow-lg',
    lg: 'w-20 h-20 text-3xl shadow-lg'
  };

  if (!props.size) return sizeClass.lg;
  return sizeClass[props.size];
});
</script>

<template>
  <div
    :title="text"
    :class="`${bgClass || 'bg-white'} ${customClass} ${circleClass}`"
    class="
      rounded-full
      flex items-center justify-center
      select-none
    "
  >
    {{ initials }}
  </div>
</template>
