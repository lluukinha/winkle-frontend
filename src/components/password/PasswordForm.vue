<script setup lang="ts">
import { IPassword } from "../../repositories/passwords/IPassword";
import { ref } from "@vue/reactivity";
import { onBeforeMount, onMounted, Ref } from "vue";
import WinkleScripts from "../../scripts/WinkleScripts";
import { IFolder } from "../../repositories/passwords/IFolder";
import EyeIcon from "../shared/EyeIcon.vue";
import PasswordStore from "../../store/passwords/PasswordStore";

const props = defineProps<{ newPassword?: IPassword }>();
const emit = defineEmits(["save"]);
const password: Ref<IPassword> = ref({
  type: 'password',
  name: '',
  description: '',
  login: '',
  password: '',
  url: '',
  folder: { id: '', name: '' }
});

const formSubmit: Ref<HTMLElement | undefined> = ref();
const folderIsInput: Ref<boolean> = ref(PasswordStore.foldersList.value.length === 0);
const folderInput: Ref<HTMLElement | undefined> = ref();
const folderSelect: Ref<HTMLElement | undefined> = ref();
const firstInput : Ref<HTMLElement | undefined> = ref();
const isShowingPassword : Ref<boolean> = ref(false);
const urlSelect: Ref<HTMLElement | undefined> = ref();
const urlInput: Ref<HTMLElement | undefined> = ref();
const selectedUrl: Ref<string> = ref('');
const selectedUrlAsInput: Ref<boolean> = ref(false);

const clearSelectedFolder = () => {
  password.value.folder = { id: '', name: '' };
}

const changeFolder = (e: Event) => {
  if (password.value.folder.id === "99999") {
    clearSelectedFolder();
    folderIsInput.value = true;
    setTimeout(() => { folderInput.value?.focus(); }, 300);
    return;
  }

  const { id } = password.value.folder;
  const newFolder = PasswordStore.foldersList.value.find((f: IFolder) => f.id === id);
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
  setTimeout(() => { folderSelect.value?.focus(); }, 300);
};

const fillPassword = (newPassword: IPassword) => {
  password.value = JSON.parse(JSON.stringify(newPassword));
  const urlFromList = WinkleScripts.urlTypes.find(t => t.url === password.value.url);
  selectedUrl.value = urlFromList ? urlFromList.name : 'other';
  if (selectedUrl.value === 'other') selectedUrlAsInput.value = true;
};

const transformUrlInDropdown = () => {
  selectedUrlAsInput.value = false;
  selectedUrl.value = '';
  setTimeout(() => { urlSelect.value?.focus(); }, 300);
}

const changeUrl = (e: Event) => {
  selectedUrlAsInput.value = selectedUrl.value === "other";
  if (selectedUrl.value === "other") {
    password.value.url = 'http://';
    setTimeout(() => { urlInput.value?.focus(); }, 300);
    return;
  }

  const urlType = WinkleScripts.urlTypes.find(u => u.name === selectedUrl.value);
  const newUrl = urlType ? urlType.url : '';
  password.value.url = newUrl;
};

const handleSave = (e: Event) => {
  e.preventDefault();
  emit('save', password.value);
};

const sendForm = () => { formSubmit.value?.click(); };

onBeforeMount(() => {
  if (props.newPassword) fillPassword(props.newPassword);
})

onMounted(() => firstInput.value?.focus());

defineExpose({ sendForm });
</script>

<template>
  <form ref="form" class="w-full" autocomplete="off" @submit="handleSave">
    <button type="submit" class="hidden" ref="formSubmit"></button>
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
          for="inline-full-name"
        >
          {{ $t("passwords.form.name") }} *
        </label>
      </div>
      <div class="md:w-2/3">
        <input
          ref="firstInput"
          class="
            bg-gray-200
            appearance-none
            border-2 border-gray-200
            rounded
            w-full
            py-2
            px-4
            text-gray-700
            leading-tight
            focus:outline-none focus:bg-white focus:border-purple-500
          "
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
        <label
          class="
            text-gray-500
            font-bold
            md:text-right
            mb-1
            md:mb-0
            pr-4
            flex
            items-center
            justify-center
            md:justify-end
          "
          for="inline-full-login"
        >
          {{ $t("passwords.form.login") }}
        </label>
      </div>
      <div class="md:w-2/3">
        <input
          class="
            bg-gray-200
            appearance-none
            border-2 border-gray-200
            rounded
            w-full
            py-2
            px-4
            text-gray-700
            leading-tight
            focus:outline-none focus:bg-white focus:border-purple-500
          "
          id="inline-full-login"
          type="text"
          v-model="password.login"
          :placeholder="$t('passwords.form.login-placeholder')"
        />
      </div>
    </div>
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          class="
            text-gray-500
            font-bold
            md:text-right
            mb-1
            md:mb-0
            pr-4
            flex
            items-center
            justify-center
            md:justify-end
          "
          for="inline-password"
        >
          {{ $t("passwords.form.password") }}
        </label>
      </div>
      <div class="md:w-2/3 flex">
        <input
          class="
            bg-gray-200
            appearance-none
            border-2 border-gray-200
            rounded rounded-tr-none rounded-br-none
            w-full
            py-2
            px-4
            text-gray-700
            leading-tight
            focus:outline-none focus:bg-white focus:border-purple-500
          "
          id="inline-password"
          :type="isShowingPassword ? 'text' : 'password'"
          :placeholder="$t('passwords.form.password-placeholder')"
          v-model="password.password"
        />
        <span
          class="
            cursor-pointer
            bg-gray-300
            hover:bg-gray-400 flex items-center px-4
            select-none
            rounded rounded-tl-none rounded-bl-none
          "
          @click="isShowingPassword = !isShowingPassword"
          :title="$t('passwords.form.show-password')"
        >
          <EyeIcon :isShowing="isShowingPassword" />
        </span>
      </div>
    </div>

    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
          for="inline-full-url"
        >
          {{ $t("passwords.form.url") }}
        </label>
      </div>
      <div class="md:w-2/3">
        <select
          ref="urlSelect"
          class="
            bg-gray-200
            appearance-none
            border-2 border-gray-200
            rounded
            w-full
            py-2
            px-4
            text-gray-700
            leading-tight
            focus:outline-none focus:bg-white focus:border-purple-500
          "
          id="url-select"
          v-model="selectedUrl"
          @change="changeUrl"
          v-if="!selectedUrlAsInput"
        >
          <option value="" disabled>
            {{ $t("passwords.form.select") }}
          </option>
          <option value="other">
            {{ $t("passwords.form.url-select-other") }}
          </option>
          <option
            v-for="url in WinkleScripts.urlTypes"
            :key="url.name"
            :value="url.name"
          >
            {{ url.name }}
          </option>
        </select>

        <div v-if="selectedUrlAsInput" class="flex">
          <input
            class="
              bg-gray-200
              appearance-none
              border-2 border-gray-200
              rounded rounded-tr-none rounded-br-none
              w-full
              py-2
              px-4
              text-gray-700
              leading-tight
              focus:outline-none focus:bg-white focus:border-purple-500
            "
            id="inline-full-url"
            type="text"
            v-model="password.url"
            :placeholder="$t('passwords.form.url-placeholder')"
            ref="urlInput"
            :readonly="selectedUrl !== 'other'"
          />
          <button
            type="button"
            @click="transformUrlInDropdown()"
            class="
              bg-gray-200
              py-2
              px-4
              rounded rounded-tl-none rounded-bl-none
            "
            :title="$t('passwords.form.url-back-button-title')"
          >
            <!-- list icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <!-- end list icon -->
          </button>
        </div>
      </div>
    </div>

    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
          for="inline-full-folder"
        >
          {{ $t("passwords.form.folder") }}
        </label>
      </div>
      <div class="md:w-2/3">
        <select
          class="
            bg-gray-200
            appearance-none
            border-2 border-gray-200
            rounded
            w-full
            py-2
            px-4
            text-gray-700
            leading-tight
            focus:outline-none focus:bg-white focus:border-purple-500
          "
          @change="changeFolder"
          v-show="!folderIsInput"
          v-model="password.folder.id"
          ref="folderSelect"
        >
          <option value="" disabled>
            {{ $t("passwords.form.select") }}
          </option>
          <option value="99999">
            {{ $t("passwords.form.folder-select-other") }}
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
            class="
              uppercase
              bg-gray-200
              appearance-none
              border-2 border-gray-200
              rounded
              w-full
              py-2
              px-4
              text-gray-700
              leading-tight
              focus:outline-none focus:bg-white focus:border-purple-500
            "
            id="inline-full-folder"
            type="text"
            v-model="password.folder.name"
            :placeholder="$t('passwords.form.folder-placeholder')"
          />
          <button
            v-if="PasswordStore.foldersList.value.length > 0"
            type="button"
            @click="transformFolderInDropdown()"
            class="
              bg-gray-200
              py-2
              px-4
              rounded rounded-tl-none rounded-bl-none
            "
            :title="$t('passwords.form.url-back-button-title')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
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
          </button>
        </div>
      </div>
    </div>

    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
          for="inline-full-desc"
        >
          {{ $t("passwords.form.description") }}
        </label>
      </div>
      <div class="md:w-2/3">
        <textarea
          class="
            bg-gray-200
            appearance-none
            border-2 border-gray-200
            rounded
            w-full
            py-2
            px-4
            text-gray-700
            leading-tight
            focus:outline-none focus:bg-white focus:border-purple-500
          "
          id="inline-full-desc"
          type="text"
          v-model="password.description"
          :placeholder="$t('passwords.form.description-placeholder')"
        />
      </div>
    </div>
  </form>
</template>