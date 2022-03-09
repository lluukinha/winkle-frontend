<script setup lang="ts">
import { computed } from "@vue/runtime-core";
import { IPassword } from "../../repositories/passwords/IPassword";
import PasswordRepository from "../../repositories/passwords/PasswordRepository";
import WinkleScripts from "../../scripts/WinkleScripts";
import i18n from "../../scripts/internacionalization/i18n";
import showErrorMessage from "../../scripts/ErrorLogs";
import RemoveIcon from "../icons/RemoveIcon.vue";
import { ref, Ref } from "vue";
import PasswordStore from "../../store/passwords/PasswordStore";

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

const showOptions = (e: MouseEvent) => {
  isShowingOptions.value = true;
  setTimeout(() => {
    if (optionsMenu.value) optionsMenu.value.style.top = `${e.y}px`;
  }, 50);
};

const changeFolder = (passwordId: string, folderId: string) => {
  isShowingOptions.value = false;
  WinkleScripts.setLoading(true);
  PasswordRepository.changeFolder(passwordId, folderId)
    .then((newPassword: IPassword) => {
      PasswordStore.changePasswordInList(newPassword);
    })
    .catch(showErrorMessage)
    .finally(() => { WinkleScripts.setLoading(false); })
};

const isShowingOptions: Ref<boolean> = ref(false);
const optionsMenu: Ref<HTMLElement | undefined> = ref();
const foldersList = computed(() => {
  return PasswordStore.foldersList.value.filter(f => f.id !== props.password.folder.id);
});

</script>

<template>
  <div class="card">
    <div class="card-top">
      <div @click="handleEdit()">
        <div class="card-avatar">
          {{ initial }}
        </div>
      </div>
      <div class="flex items-start justify-between w-full">
        <div class="pl-3 w-44" @click="handleEdit()">
          <p class="card-name">
            {{ password.name }}
          </p>
          <p
            class="text-sm leading-normal pt-2 text-gray-500 truncate"
            :title="password.url"
          >
            {{ password.url }}
          </p>
        </div>
        <!-- a v-if="password.url" :title="$t('passwords.open-url')" target="_blank" :href="password.url">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </a -->
        <div>
          <svg @click="showOptions" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
          <template v-if="isShowingOptions">
            <div ref="optionsMenu" class="optionsmenu">
              <ul class="py-2 px-4">
                <li :class="{ disabled: !password.url }">
                  <a :href="password.url" target="_blank" v-if="password.url">
                    {{ $t('passwords.open-url') }}
                  </a>
                  <span v-else>{{ $t('passwords.open-url') }}</span>
                </li>
              </ul>
              <hr>
              <ul class="py-2 px-4">
                <li
                  v-for="folder in foldersList"
                  :key="folder.id"
                  class="li"
                  :class="{ hidden: password.folder.id === folder.id }"
                  @click="changeFolder(password.id, folder.id)"
                >
                  Mover para {{ folder.name }}
                </li>
              </ul>
            </div>
            <div class="overlay" @click="isShowingOptions = false" />
          </template>
        </div>
      </div>
    </div>
    <div class="px-2 mt-4">
      <div
        class="focus:outline-none flex"
        :class="{
          'justify-between': password.password || password.login,
          'justify-end': !password.password && !password.login
        }"
      >
        <button
          class="copy-btn"
          @click="WinkleScripts.copyText(password.login)"
          :title="$t('passwords.copy-login')"
          v-if="password.login"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg> {{ $t('passwords.login') }}
        </button>
        <button
          class="copy-btn"
          @click="WinkleScripts.copyText(password.password)"
          :title="$t('passwords.copy-password')"
          v-if="password.password"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg> {{ $t('passwords.password') }}
        </button>
        <button
          class="remove-btn"
          @click="handleRemove()"
          :title="$t('passwords.remove')"
        >
          <RemoveIcon />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.card {
  @apply focus:outline-none
      w-full md:w-80 md:mx-2 mb-7 p-6
      bg-white dark:bg-gray-800
      border dark:border-gray-700
      shadow-lg rounded;
}

.card-top {
  @apply flex items-center
         border-b border-gray-300
         dark:border-gray-700
         pb-6 text-left cursor-pointer;
}

.card-avatar {
  @apply  w-12 h-12 rounded-full
          bg-gray-300 dark:bg-gray-700
          shadow-lg flex items-center justify-center
          text-xl;
}

.card-name {
  @apply  focus:outline-none truncate
          text-xl font-medium leading-5
          text-gray-800 dark:text-white;
}

button {
  @apply py-2 px-3 rounded-full leading-3 flex items-center text-xs;
}
.copy-btn {
  @apply  text-gray-700 dark:text-gray-300
          bg-gray-100 dark:bg-gray-600 shadow
          hover:bg-gray-200 dark:hover:bg-gray-700;
}

.remove-btn {
  @apply  text-red-700 bg-red-100 hover:bg-red-300
          dark:bg-red-600 dark:text-red-100 dark:hover:bg-red-700
}

.overlay {
  @apply fixed bg-black opacity-0 inset-0 z-0 h-screen w-screen top-0 left-0 cursor-default;
}

li {
  @apply  flex justify-center items-center
          py-2 px-4 text-sm
          text-gray-700
          hover:bg-gray-300 dark:hover:bg-gray-600
          dark:text-gray-200
          dark:hover:text-white
          cursor-pointer
}

li.disabled {
  @apply text-gray-400 cursor-not-allowed
}

.optionsmenu {
  @apply absolute z-50 p-2 select-none
          right-4 md:right-auto
          text-base list-none
          bg-white rounded divide-y divide-gray-200
          shadow dark:bg-gray-800 dark:divide-gray-700
}
</style>