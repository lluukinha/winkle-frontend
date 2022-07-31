<script setup lang="ts">
import { IImportedPassword } from "../../../repositories/passwords/IImportedPassword";
import PasswordStore from "../../../store/passwords/PasswordStore";
const props = defineProps<{ list: IImportedPassword[] }>();
</script>

<template>
  <div>
    <div class="my-4 flex justify-center">
      <div class="mr-10 text-lg font-bold">{{ $t('passwords.import.obs') }}: </div>
      <div
        class="
          text-left text-sm font-semibold
          text-red-700 dark:text-red-400
        "
      >
        1 - {{ $t('passwords.import.obs-1') }}<br>
        2 - {{ $t('passwords.import.obs-2') }}
      </div>
    </div>
    <ul>
      <li
        class="
          flex items-center
          text-left text-xs py-2 font-bold
          bg-gray-300 dark:bg-gray-800"
      >
        <div class="w-full flex items-center text-left">
          <div class="w-1/4 px-2">
            {{ $t('passwords.import.headers.name') }}
          </div>
          <div class="w-1/4 px-2">
            {{ $t('passwords.import.headers.login') }}
          </div>
          <div class="w-1/4 px-2">
            {{ $t('passwords.import.headers.password') }}
          </div>
          <div class="w-1/4 px-2">
            {{ $t('passwords.import.headers.folder') }}
          </div>
        </div>
        <div></div>
      </li>
      <li
        v-for="(p, index) in list"
        :key="`import_${index}`"
        class="flex items-center text-left text-xs py-2 border-b-2"
        :class="{ 'bg-red-200': !p.name || p.name.length === 0 }"
      >
      <div class="w-full flex items-center">
        <div class="w-1/4 px-2">
          <input
            type="text"
            v-model="p.name"
            class="p-1 shadow bg-gray-100 dark:bg-gray-500 px-2 w-full mb-1"
            placeholder="Nome"
            title="Nome da senha"
          />
          <input
            type="text"
            v-model="p.url"
            class="p-1 shadow bg-gray-100 dark:bg-gray-500 px-2 w-full"
            placeholder="Url"
            title="URL da senha"
          />
        </div>
        <div class="w-1/4 truncate px-2" :title="p.username">
          {{ p.username }}
        </div>
        <div class="w-1/4 px-2 cursor-pointer" @click="p.isShowingPassword = !p.isShowingPassword">
          <span class="p-2 rounded hover:bg-gray-200">
            <template v-if="p.isShowingPassword">
              {{ p.password }}
            </template>
            <template v-else-if="p.password">
              {{ p.password.split('').map(() => '*').join('') }}
            </template>
          </span>
        </div>
        <div class="w-1/4 px-2">
          <select
            class="p-1 shadow bg-gray-100 dark:bg-gray-500 px-2 w-full uppercase mb-1"
            v-model="p.folderName"
            placeholder="test"
          >
            <option :value="undefined" disabled>
              {{ $t("passwords.form.select") }}
            </option>
            <option
              v-for="folder in PasswordStore.foldersList.value"
              :key="folder.id"
              :value="folder.name"
            >
              {{ folder.name }}
            </option>
          </select>
        </div>
        </div>
        <div class="px-2 cursor-pointer hover:text-red-500 opacity-50 hover:opacity-100" @click="list.splice(index, 1)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      </li>
    </ul>
  </div>
</template>