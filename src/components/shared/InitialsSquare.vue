<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{
  text: string;
  customClass?: string;
  bgClass?: string;
}>();

const initials = computed(() => {
  const words = props.text.split(' ');
  const lastIndex = words.length - 1;
  if (lastIndex === 0) return words[0].charAt(0);
  return `${words[0].charAt(0)}${words[lastIndex].charAt(0)}`;
});
</script>

<template>
  <div
    :title="text"
    :class="`${bgClass || 'bg-white'} ${customClass}`"
    class="
      rounded-full
      w-20 h-20
      flex items-center justify-center
      text-3xl select-none
      shadow-lg
    "
  >
    {{ initials }}
  </div>
</template>
