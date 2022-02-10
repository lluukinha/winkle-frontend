<script setup lang="ts">
import { computed } from "@vue/runtime-core";
import { IPassword } from "../../repositories/passwords/IPassword";
import PasswordRepository from "../../repositories/passwords/PasswordRepository";
import WinkleScripts from "../../scripts/WinkleScripts";
import i18n from "../../scripts/internacionalization/i18n";
import showErrorMessage from "../../scripts/ErrorLogs";

const { t } = i18n.element.global;
const props = defineProps<{ password: IPassword }>();
const emit = defineEmits(["edit", "remove"]);
const initial = computed(() => props.password.name.charAt(0).toUpperCase());
const handleEdit = () => { emit("edit", props.password); };
const handleRemove = () => {
  const willRemove = confirm(t('passwords.remove-confirm'));
  if (!willRemove) return;

  WinkleScripts.setLoading(true);
  PasswordRepository.removePassword(Number(props.password.id))
    .then(() => { emit("remove", Number(props.password.id)); })
    .catch(showErrorMessage)
    .finally(() => { WinkleScripts.setLoading(false); });
};
</script>

<template>
  <div
    class="
      focus:outline-none
      w-full
      md:w-80 md:mx-2
      mb-7
      bg-white
      p-6
      shadow
      rounded
    "
  >
    <div class="flex items-center border-b border-gray-200 pb-6 text-left cursor-pointer">
      <div @click="handleEdit()">
        <div class="avatar w-12 h-12 rounded-full bg-gray-300 shadow flex items-center justify-center text-xl">
          {{ initial }}
        </div>
      </div>
      <div class="flex items-start justify-between w-full">
        <div class="pl-3 w-44" @click="handleEdit()">
          <p
            class="
              focus:outline-none
              text-xl
              font-medium
              leading-5
              text-gray-800
              truncate
            "
          >
            {{ password.name }}
          </p>
          <p
            class="text-sm leading-normal pt-2 text-gray-500 truncate"
            :title="password.url"
          >
            {{ password.url }}
          </p>
        </div>
        <a v-if="password.url" :title="$t('passwords.open-url')" target="_blank" :href="password.url">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </a>
      </div>
    </div>
    <div class="px-2 mt-4">
      <div tabindex="0" class="focus:outline-none flex justify-between">
        <button
          class="
            py-2
            px-3
            text-xs
            leading-3
            shadow
            text-gray-700
            bg-gray-100
            hover:bg-gray-200
            rounded-full
            flex items-center
          "
          @click="WinkleScripts.copyText(password.login)"
          :title="$t('passwords.copy-login')"
          v-if="password.login"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg> {{ $t('passwords.login') }}
        </button>
        <button
          class="
            py-2
            px-3
            text-xs
            leading-3
            rounded-full
            text-gray-700
            bg-gray-100
            hover:bg-gray-200
            flex
            items-center
          "
          @click="WinkleScripts.copyText(password.password)"
          :title="$t('passwords.copy-password')"
          v-if="password.password"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg> {{ $t('passwords.password') }}
        </button>
        <button
          class="
            py-2
            px-3
            text-xs
            leading-3
            text-red-700
            bg-red-100
            hover:bg-red-300
            rounded-full
            flex
            items-center
          "
          @click="handleRemove()"
          :title="$t('passwords.remove')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>