<script setup lang="ts">
import Modal from "../shared/Modal.vue";
import { IPassword } from "../../repositories/passwords/IPassword";
import { ref, reactive } from "@vue/reactivity";
import { onMounted, Ref } from "vue";
import PasswordRepository from "../../repositories/passwords/PasswordRepository";
import WinkleScripts from "../../scripts/WinkleScripts";
import showErrorMessage from "../../scripts/ErrorLogs";
const props = defineProps<{ password: IPassword }>();
const emit = defineEmits(["close", "save"]);

const firstInput: Ref<HTMLElement | null> = ref(null);
const formSubmit: Ref<HTMLElement | null> = ref(null);
const updatedPassword: Ref<IPassword> = ref(JSON.parse(JSON.stringify(props.password)));
const isShowingLogin: Ref<Boolean> = ref(false);
const isShowingPassword: Ref<Boolean> = ref(false);

onMounted(() => {
  const urlFromList = WinkleScripts.urlTypes.find(t => t.url === updatedPassword.value.url);
  selectedUrl.value = urlFromList ? urlFromList.name : 'Outro';
  firstInput.value?.focus();
});
const sendForm = () => { formSubmit.value?.click(); };
const handleClose = () => { emit("close"); };
const handleSave = (e: Event) => {
  e.preventDefault();

  const { url } = updatedPassword.value;
  if (!url.startsWith('http')) updatedPassword.value.url = `https://${url}`;

  WinkleScripts.setLoading(true);
  PasswordRepository.updatePassword(updatedPassword.value)
    .then((newPass: IPassword) => { emit("save", newPass); })
    .catch(showErrorMessage)
    .finally(() => { WinkleScripts.setLoading(false); });
};

const selectedUrl : Ref<string> = ref('');
const changeUrl = (e: Event) => {
  const urlType = WinkleScripts.urlTypes.find(u => u.name === selectedUrl.value);
  const newUrl = urlType ? urlType.url : '';
  updatedPassword.value.url = newUrl;
};
</script>

<template>
  <Modal @close="handleClose()" @save="sendForm()">
    <h2 class="text-xl font-bold py-4">{{ $t("passwords.edit") }}</h2>
    <form class="w-full" @submit="handleSave">
      <button type="submit" class="hidden" ref="formSubmit"></button>
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label
            class="
              block
              text-gray-500
              font-bold
              md:text-right
              mb-1
              md:mb-0
              pr-4
            "
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
            v-model="updatedPassword.name"
            :placeholder="$t('passwords.form.name-placeholder')"
            required
          />
        </div>
      </div>
      <div class="md:flex md:items-center mb-6">
        <div
          class="
            md:w-1/3
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
        >
          <label for="inline-full-login">
            {{ $t("passwords.form.login") }}
          </label>
          <span
            class="ml-2 cursor-pointer"
            @click="WinkleScripts.copyText(updatedPassword.login)"
            :title="$t('passwords.copy-login')"
            type="button"
          >
            <!-- copy icon -->
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
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <!-- end copy icon -->
          </span>
          <span
            class="cursor-pointer"
            @click="isShowingLogin = !isShowingLogin"
            :title="$t('passwords.form.show-login')"
          >
            <!-- EYE ICON -->
            <svg
              v-if="!isShowingLogin"
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>

            <svg
              v-else
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
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
            <!-- END EYE ICON -->
          </span>
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
            :type="isShowingLogin ? 'text' : 'password'"
            v-model="updatedPassword.login"
            :placeholder="$t('passwords.form.login-placeholder')"
          />
        </div>
      </div>
      <div class="md:flex md:items-center mb-6">
        <div
          class="
            md:w-1/3
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
        >
          <label for="inline-password">
            {{ $t("passwords.form.password") }}
          </label>
          <span
            class="ml-2 cursor-pointer"
            @click="WinkleScripts.copyText(updatedPassword.password)"
            :title="$t('passwords.copy-password')"
          >
            <!-- copy icon -->
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
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <!-- end copy icon -->
          </span>
          <span
            class="cursor-pointer"
            @click="isShowingPassword = !isShowingPassword"
            :title="$t('passwords.form.show-password')"
          >
            <!-- EYE ICON -->
            <svg
              v-if="!isShowingPassword"
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>

            <svg
              v-else
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
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
            <!-- END EYE ICON -->
          </span>
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
            id="inline-password"
            :type="isShowingPassword ? 'text' : 'password'"
            :placeholder="$t('passwords.form.password-placeholder')"
            v-model="updatedPassword.password"
          />
        </div>
      </div>

      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label
            class="
              block
              text-gray-500
              font-bold
              md:text-right
              mb-1
              md:mb-0
              pr-4
            "
            for="inline-full-url"
          >
            {{ $t("passwords.form.url") }}
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
            id="url-select"
            v-model="selectedUrl"
            @change="changeUrl"
          >
            <option
              v-for="url in WinkleScripts.urlTypes"
              :key="url.name"
              :value="url.name"
            >
              {{ url.name }}
            </option>
          </select>
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
              mt-2
            "
            id="inline-full-url"
            type="text"
            v-model="updatedPassword.url"
            :placeholder="$t('passwords.form.url-placeholder')"
            :readonly="selectedUrl !== 'Outro'"
          />
        </div>
      </div>

      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label
            class="
              block
              text-gray-500
              font-bold
              md:text-right
              mb-1
              md:mb-0
              pr-4
            "
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
            v-model="updatedPassword.description"
            :placeholder="$t('passwords.form.description-placeholder')"
          />
        </div>
      </div>
    </form>
  </Modal>
</template>