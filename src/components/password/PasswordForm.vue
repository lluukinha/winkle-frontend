<script setup lang="ts">
import { IPassword } from '../../repositories/passwords/IPassword';
import { ref } from '@vue/reactivity';
import { onBeforeMount, onMounted, Ref } from 'vue';
import { IFolder } from '../../repositories/folder/IFolder';
import EyeIcon from '../icons/EyeIcon.vue';
import PasswordStore from '../../store/passwords/PasswordStore';
import CopyIcon from '../icons/CopyIcon.vue';
import WinkleScripts from '../../scripts/WinkleScripts';

const props = defineProps<{ newPassword?: IPassword }>();
const emit = defineEmits(['save']);
const password: Ref<IPassword> = ref({
  type: 'password',
  id: '',
  name: '',
  description: '',
  login: '',
  password: '',
  url: '',
  folder: { id: '', name: '' },
});

const formSubmit: Ref<HTMLElement | undefined> = ref();
const folderIsInput: Ref<boolean> = ref(
  PasswordStore.foldersList.value.length === 0
);
const folderInput: Ref<HTMLElement | undefined> = ref();
const folderSelect: Ref<HTMLElement | undefined> = ref();
const firstInput: Ref<HTMLElement | undefined> = ref();
const isShowingPassword: Ref<boolean> = ref(false);
const urlInput: Ref<HTMLElement | undefined> = ref();

const clearSelectedFolder = () => {
  password.value.folder = { id: '', name: '' };
};

const changeFolder = (e: Event) => {
  if (password.value.folder.id === '99999') {
    clearSelectedFolder();
    folderIsInput.value = true;
    setTimeout(() => {
      folderInput.value?.focus();
    }, 300);
    return;
  }

  const { id } = password.value.folder;
  const newFolder = PasswordStore.foldersList.value.find(
    (f: IFolder) => f.id === id
  );
  if (!newFolder) {
    clearSelectedFolder();
    folderIsInput.value = true;
    return;
  }

  password.value.folder = newFolder;
};

const transformFolderInDropdown = () => {
  clearSelectedFolder();
  folderIsInput.value = false;
  setTimeout(() => {
    folderSelect.value?.focus();
  }, 300);
};

const fillPassword = (newPassword: IPassword) => {
  password.value = { ...newPassword };
};

const handleSave = (e: Event) => {
  e.preventDefault();
  emit('save', password.value);
};

const sendForm = () => {
  formSubmit.value?.click();
};

onBeforeMount(() => {
  if (props.newPassword) fillPassword(props.newPassword);
});

onMounted(() => firstInput.value?.focus());

defineExpose({ sendForm });
</script>

<template>
  <form
    ref="form"
    class="w-full"
    autocomplete="off"
    aria-autocomplete="none"
    @submit="handleSave"
  >
    <button type="submit" class="hidden" ref="formSubmit"></button>
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label for="inline-full-name">
          {{ $t('passwords.form.name') }} *
        </label>
      </div>
      <div class="md:w-2/3">
        <input
          ref="firstInput"
          id="inline-full-name"
          type="text"
          v-model="password.name"
          required
          :placeholder="$t('passwords.form.name-placeholder')"
        />
      </div>
    </div>
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label for="inline-full-login">
          {{ $t('passwords.form.login') }}
        </label>
      </div>
      <div class="md:w-2/3 flex">
        <input
          id="inline-full-login"
          type="search"
          v-model="password.login"
          :placeholder="$t('passwords.form.login-placeholder')"
          autocomplete="off"
          aria-autocomplete="none"
        />
        <span
          class="span-button"
          @click="WinkleScripts.copyText(password.login)"
          :title="$t('passwords.copy-login')"
        >
          <CopyIcon />
        </span>
      </div>
    </div>
    <div class="md:flex md:items-center mb-6">
      <div
        class="md:w-1/3 flex items-center justify-center md:justify-end pr-3"
      >
        <label for="inline-password">
          {{ $t('passwords.form.password') }}
        </label>
        <button type="button" @click="isShowingPassword = !isShowingPassword">
          <EyeIcon :isShowing="isShowingPassword" />
        </button>
      </div>
      <div class="md:w-2/3 flex">
        <input
          class="rounded-tr-none rounded-br-none"
          id="inline-password"
          :type="isShowingPassword ? 'text' : 'password'"
          :placeholder="$t('passwords.form.password-placeholder')"
          autocomplete="new-password"
          v-model="password.password"
        />
        <span
          class="span-button"
          @click="WinkleScripts.copyText(password.password)"
          :title="$t('passwords.copy-password')"
        >
          <CopyIcon />
        </span>
      </div>
    </div>

    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label for="inline-full-url">
          {{ $t('passwords.form.url') }}
        </label>
      </div>
      <div class="md:w-2/3">
        <input
          class="rounded-tr-none rounded-br-none"
          id="inline-full-url"
          type="text"
          v-model="password.url"
          :placeholder="$t('passwords.form.url-placeholder')"
          ref="urlInput"
        />
      </div>
    </div>

    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label for="inline-full-folder">
          {{ $t('passwords.form.folder') }}
        </label>
      </div>
      <div class="md:w-2/3">
        <select
          @change="changeFolder"
          v-show="!folderIsInput"
          v-model="password.folder.id"
          ref="folderSelect"
        >
          <option value="" disabled>
            {{ $t('passwords.form.select') }}
          </option>
          <option value="99999">
            {{ $t('passwords.form.folder-select-other') }}
          </option>
          <option
            v-for="folder in PasswordStore.foldersList.value"
            :key="folder.id"
            :value="folder.id"
          >
            {{ folder.name.toUpperCase() }}
          </option>
        </select>
        <div v-if="folderIsInput" class="flex">
          <input
            ref="folderInput"
            class="uppercase rounded-tr-none rounded-br-none"
            id="inline-full-folder"
            type="text"
            v-model="password.folder.name"
            :placeholder="$t('passwords.form.folder-placeholder')"
          />
          <span
            v-if="PasswordStore.foldersList.value.length > 0"
            @click="transformFolderInDropdown()"
            class="span-button"
            :title="$t('passwords.form.url-back-button-title')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>

    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label for="inline-full-desc">
          {{ $t('passwords.form.description') }}
        </label>
      </div>
      <div class="md:w-2/3">
        <textarea
          id="inline-full-desc"
          type="text"
          v-model="password.description"
          :placeholder="$t('passwords.form.description-placeholder')"
        />
      </div>
    </div>
  </form>
</template>

<style lang="postcss" scoped>
label {
  @apply block text-gray-500 dark:text-gray-200 font-bold md:text-right mb-1 md:mb-0 pr-4;
}

.span-button {
  @apply cursor-pointer
          bg-gray-200 dark:bg-gray-600
          hover:bg-gray-400 dark:hover:bg-gray-800
          flex items-center px-4
          select-none
          rounded rounded-tl-none rounded-bl-none;
}

input,
select,
textarea {
  @apply bg-gray-200 dark:bg-gray-500
            appearance-none
            border-2 border-gray-200 dark:border-gray-600
            rounded
            w-full py-2 px-4
            text-gray-700 dark:text-gray-200
            leading-tight
            focus:outline-none focus:bg-white focus:border-purple-500
            dark:focus:bg-gray-400 dark:focus:border-purple-800
            dark:focus:text-gray-800;
}
</style>
