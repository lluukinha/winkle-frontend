<script setup lang="ts">
import Modal from '../../components/shared/Modal.vue';
import DashboardHeader from '../../components/shared/DashboardHeader.vue';
import DashboardContainer from '../../components/shared/DashboardContainer.vue';
import { onMounted, ref, Ref } from 'vue';
import UserRepository from '../../repositories/user/UserRepository';
import WinkleScripts from '../../scripts/WinkleScripts';
import { IUser } from '../../repositories/user/UserInterfaces';
import InitialsSquare from '../../components/shared/InitialsSquare.vue';
import WinkleButton from '../../components/shared/WinkleButton.vue';
import UpdateUserEmail from '../../components/user/UpdateUserEmail.vue';
import { showSuccess } from '../../scripts/NotificationScript';
import i18n from '../../scripts/internacionalization/i18n';
import UpateUserPassword from '../../components/user/UpateUserPassword.vue';
import UpdateUserMasterPassword from '../../components/user/UpdateUserMasterPassword.vue';
import UserStore from '../../store/user/UserStore';

onMounted(() => UserStore.getUserData());

const { t } = i18n.element.global;
const isUpdatingEmail: Ref<boolean> = ref(false);
const isUpdatingPassword: Ref<boolean> = ref(false);
const isUpdatingMasterPassword: Ref<boolean> = ref(false);
const isShowingMasterAlert: Ref<boolean> = ref(false);

const userUpdated = (updatedUser: IUser) => {
  UserStore.updateUserData(updatedUser);
  isUpdatingEmail.value = false;
  isUpdatingPassword.value = false;
  isUpdatingMasterPassword.value = false;

  showSuccess(
    t('user.messages.updated'),
    t('user.messages.updated-description', { email: updatedUser.email })
  );
};
</script>

<template>
  <Modal
    v-if="isShowingMasterAlert"
    :removeSave="true"
    @close="isShowingMasterAlert = false"
  >
    <h2 class="text-2xl font-bold uppercase">
      {{ $t('user.master-alert.title') }}
    </h2>
    <div class="text-justify mt-4">
      <p class="my-2">{{ $t('user.master-alert.description') }}</p>
    </div>
  </Modal>
  <UpdateUserEmail
    v-if="isUpdatingEmail"
    @close="isUpdatingEmail = false"
    @save="userUpdated"
  />
  <UpateUserPassword
    v-if="isUpdatingPassword"
    @close="isUpdatingPassword = false"
    @save="userUpdated"
  />
  <UpdateUserMasterPassword
    v-if="isUpdatingMasterPassword"
    @close="isUpdatingMasterPassword = false"
    @save="userUpdated"
  />
  <DashboardHeader :title="$t('user.title')" />
  <DashboardContainer v-if="UserStore.user.value">
    <div class="w-full flex flex-col items-center md:items-end">
      <div class="w-full mt-6 p-1 text-left">
        <div class="w-full dark:text-gray-200">
          <h1 class="md:text-xl">
            <b>{{ $t('user.content.user') }}:</b> {{ UserStore.user.value.name }}
          </h1>
          <h2 class="md:text-lg flex flex-wrap items-center">
            <b>{{ $t('user.content.email') }}:</b>
            <span
              class="flex items-center ml-2 mr-2 hover:underline cursor-pointer"
              @click="isUpdatingEmail = true"
            >
            {{ UserStore.user.value.email }}
            <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            </span>
            <span
              class="text-xs text-green-500 dark:text-green-400"
              v-if="UserStore.user.value.emailVerified"
            >
              ({{ $t('user.content.verified') }})
            </span>
            <span class="text-xs text-red-500 dark:text-red-400" v-if="!UserStore.user.value.emailVerified">
              ({{ $t('user.content.not-verified') }})
            </span>
          </h2>
          <h2 class="md:text-lg">
            <b>{{ $t('user.content.created-at') }}:</b>
            {{ UserStore.timeSince(UserStore.user.value.createdAt) }}
          </h2>
          <h2 class="md:text-lg mt-4">
            <b>{{ $t('user.content.plan') }}:</b> {{ UserStore.user.value.planName }}
          </h2>
          <h2 class="md:text-lg">
            <b>{{ $t('user.content.expires-at') }}:</b> {{ UserStore.timeTo(UserStore.user.value.expirationDate) }}
          </h2>
        </div>
        <div class="w-full mt-10 md:mt-16 mb-10">
          <WinkleButton
            type="success"
            size="xl"
            class="w-full md:w-auto"
            @click="isUpdatingEmail = true"
          >
            {{ $t('user.update-email') }}
          </WinkleButton>

          <br>

          <WinkleButton
            type="success"
            size="xl"
            class="w-full md:w-auto mt-4"
            @click="isUpdatingPassword = true"
          >
            {{ $t('user.update-password') }}
          </WinkleButton>

          <br>

          <div class="mt-4">
            <WinkleButton
              type="success"
              size="xl"
              :disabled="!UserStore.canUpdateMasterPassword.value"
              class="flex items-center w-full md:w-auto"
              @click="isUpdatingMasterPassword = true"
            >
              {{ $t('user.update-master-password') }}
              <svg v-if="!UserStore.canUpdateMasterPassword.value" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-300 drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </WinkleButton>
            <span
              class="text-xs hover:underline cursor-pointer"
              v-if="!UserStore.canUpdateMasterPassword.value"
              @click="isShowingMasterAlert = true"
            >
              {{ $t('user.master-alert.title') }}
            </span>
          </div>
          </div>
      </div>
      <div class="w-full text-center text-xs text-gray-500 mt-10">
        {{ $t('last-update') }}:
        {{ UserStore.timeSince(UserStore.user.value.lastUpdate) }}
      </div>
    </div>
  </DashboardContainer>
</template>

<style>
</style>
