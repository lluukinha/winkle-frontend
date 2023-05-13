<script setup lang="ts">
import { computed } from '@vue/runtime-core';
import { IPassword } from '../../repositories/passwords/IPassword';
import PasswordRepository from '../../repositories/passwords/PasswordRepository';
import WinkleScripts from '../../scripts/WinkleScripts';
import i18n from '../../scripts/internacionalization/i18n';
import showErrorMessage from '../../scripts/ErrorLogs';
import RemoveIcon from '../icons/RemoveIcon.vue';
import { ref, Ref } from 'vue';
import PasswordStore from '../../store/passwords/PasswordStore';
import CopyIcon from '../icons/CopyIcon.vue';

const { t } = i18n.element.global;
const props = defineProps<{ password: IPassword }>();
const emit = defineEmits(['edit', 'remove']);

const initial = computed(() => props.password.name.charAt(0).toUpperCase());
const handleEdit = () => {
  emit('edit', props.password);
};
const handleRemove = () => {
  const willRemove = confirm(t('passwords.remove-confirm'));
  if (!willRemove) return;

  WinkleScripts.setLoading(true);
  PasswordRepository.removePassword(Number(props.password.id))
    .then(() => {
      emit('remove', Number(props.password.id));
    })
    .catch(showErrorMessage)
    .finally(() => {
      WinkleScripts.setLoading(false);
    });
};

const showOptions = (e: MouseEvent) => {
  e.preventDefault();
  isShowingOptions.value = true;
  options.value.x = e.x;
  options.value.y = e.y;
};

const changeFolder = (passwordId: string, folderId: string | null) => {
  isShowingOptions.value = false;
  WinkleScripts.setLoading(true);

  const method = !folderId ? 'removeFolder' : 'changeFolder';

  PasswordRepository[method](passwordId, folderId || '')
    .then((newPassword: IPassword) => {
      PasswordStore.changePasswordInList(newPassword);
    })
    .catch(showErrorMessage)
    .finally(() => {
      WinkleScripts.setLoading(false);
    });
};

const isShowingOptions: Ref<boolean> = ref(false);
const optionsMenu: Ref<HTMLElement | undefined> = ref();
const foldersList = computed(() =>
  PasswordStore.foldersList.value.filter(
    (f) => f.id !== props.password.folder.id
  )
);

const tryGetFavicon = computed(() => {
  const hasUrl =
    props.password.url.length > 0 && props.password.url.startsWith('http');
  if (!hasUrl) return null;
  const rawUrl = props.password.url.split('/');
  return rawUrl[0] + '//' + rawUrl[2] + '/favicon.ico';
});

const options = computed(() => ({
  items: [
    {
      label: t('passwords.open-url'),
      onClick: () => {
        const url = props.password.url.startsWith('http')
          ? props.password.url
          : `//${props.password.url}`;
        window.open(url, '_blank');
      },
      disabled: !props.password.url || props.password.url.length === 0,
      divided: true,
    },
    {
      label: t('passwords.card.remove-folder'),
      onClick: () => changeFolder(props.password.id, null),
      disabled: props.password.folder.id.length === 0,
    },
    {
      label: t('passwords.card.move-folder'),
      disabled: foldersList.value.length === 0,
      children: foldersList.value.map((f) => ({
        label: f.name,
        onClick: () => changeFolder(props.password.id, f.id),
      })),
    },
  ],
  customClass: 'dark:bg-gray-800 dark:text-white force-z-20',
  minWidth: 230,
  x: 0,
  y: 0,
}));
</script>

<template>
  <div class="card" @contextmenu="showOptions">
    <div class="card-top">
      <div @click="handleEdit()">
        <div class="card-avatar">
          <img :src="tryGetFavicon" v-if="!!tryGetFavicon" />
          <template v-else>
            {{ initial }}
          </template>
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
        <div>
          <svg
            @click="showOptions"
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
          <template v-if="isShowingOptions">
            <context-menu :show="isShowingOptions" :options="options" />
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
          'justify-end': !password.password && !password.login,
        }"
      >
        <button
          class="copy-btn"
          @click="WinkleScripts.copyText(password.login)"
          :title="$t('passwords.copy-login')"
          v-if="password.login"
        >
          <CopyIcon class="mr-2" />
          {{ $t('passwords.login') }}
        </button>
        <button
          class="copy-btn"
          @click="WinkleScripts.copyText(password.password)"
          :title="$t('passwords.copy-password')"
          v-if="password.password"
        >
          <CopyIcon class="mr-2" />
          {{ $t('passwords.password') }}
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
      shadow-lg rounded select-none;
}

.card-top {
  @apply flex items-center
         border-b border-gray-300
         dark:border-gray-700
         pb-6 text-left cursor-pointer;
}

.card-avatar {
  @apply w-12 h-12 rounded-full
          bg-gray-300 dark:bg-gray-700
          shadow-lg flex items-center justify-center
          text-xl;
}

.card-name {
  @apply focus:outline-none truncate
          text-xl font-medium leading-5
          text-gray-800 dark:text-white;
}

button {
  @apply py-2 px-3 rounded-full leading-3 flex items-center text-xs;
}
.copy-btn {
  @apply text-gray-700 dark:text-gray-300
          bg-gray-100 dark:bg-gray-600 shadow
          hover:bg-gray-200 dark:hover:bg-gray-700;
}

.remove-btn {
  @apply text-red-700 bg-red-100 hover:bg-red-300
          dark:bg-red-600 dark:text-red-100 dark:hover:bg-red-700;
}

.overlay {
  @apply fixed bg-black opacity-0 inset-0 z-0 h-screen w-screen top-0 left-0 cursor-default;
}
</style>
