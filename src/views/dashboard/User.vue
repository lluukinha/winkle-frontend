<script setup lang="ts">
import DashboardHeader from '../../components/shared/DashboardHeader.vue';
import DashboardContainer from '../../components/shared/DashboardContainer.vue';
import { computed, onMounted, ref, Ref } from 'vue';
import UserRepository from '../../repositories/user/UserRepository';
import WinkleScripts from '../../scripts/WinkleScripts';
import { IUser } from '../../repositories/user/UserInterfaces';
import InitialsSquare from '../../components/shared/InitialsSquare.vue';
import WinkleButton from '../../components/shared/WinkleButton.vue';
import UpdateUserEmail from '../../components/user/UpdateUserEmail.vue';
import { showSuccess } from '../../scripts/NotificationScript';
import i18n from '../../scripts/internacionalization/i18n';

const header: Ref<HTMLElement | undefined> = ref();
const contentHeight = computed(() => {
  const headerHeight = header.value?.clientHeight || 0;
  return { height: `calc(100% - (${headerHeight}px))` };
});

const { t } = i18n.element.global;
const user: Ref<IUser | undefined> = ref();
const getUserData = async () => {
  WinkleScripts.setLoading(true);
  const userData = await UserRepository.getUserInfo();
  WinkleScripts.setLoading(false);
  user.value = userData;
};

const timeSince = (time: string) => {
  return WinkleScripts.timeSince(new Date(time));
}

onMounted(() => getUserData());

const isUpdatingEmail: Ref<boolean> = ref(false);
const isUpdatingPassword: Ref<boolean> = ref(false);
const isUpdatingMasterPassword: Ref<boolean> = ref(false);

const userUpdated = (updatedUser: IUser) => {
  user.value = updatedUser;
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
  <UpdateUserEmail
    v-if="isUpdatingEmail"
    @close="isUpdatingEmail = false"
    @save="userUpdated"
  />
  <div ref="header">
    <DashboardHeader :title="$t('user.title')" :showSearchBox="false" />
  </div>
  <DashboardContainer :style="contentHeight" v-if="user">
    <div class="w-full flex flex-col items-center md:items-end">
      <div
        class="
          flex items-center justify-between
          bg-gray-50
          py-4 px-10
          rounded shadow-lg
          z-30
        "
      >
        <InitialsSquare
          :text="user.name"
          bgClass="bg-gray-600"
          customClass="text-white"
          class="mr-4"
        />
        <div class="text-center md:text-right">
          <h1 class="text-2xl">{{ user.name }}</h1>
          <h3 class="text-md text-gray-500">{{ user.email }}</h3>
          <span class="text-xs text-gray-500">
            {{ $t('user.created-at') }}:
            {{ timeSince(user.createdAt) }}
          </span>
        </div>

      </div>
      <div class="
          bg-gray-50
          w-full mt-6 md:-mt-10
          rounded-lg shadow-lg
          p-6 text-left
        "
      >
        <div class="w-full flex flex-wrap justify-between md:mt-16 mb-10">
          <WinkleButton
            type="success"
            size="xl"
            class="w-full md:w-auto"
            @click="isUpdatingEmail = true"
          >
            {{ $t('user.update-email') }}
          </WinkleButton>

          <WinkleButton
            type="success"
            size="xl"
            class="w-full md:w-auto"
          >
            {{ $t('user.update-password') }}
          </WinkleButton>

          <WinkleButton
            type="success"
            size="xl"
            :disabled="!user.canUpdateMasterPassword"
            class="flex items-center w-full md:w-auto"
          >
            {{ $t('user.update-master-password') }}
            <svg v-if="!user.canUpdateMasterPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-300 drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </WinkleButton>
        </div>
      </div>
      <div class="w-full text-center text-xs text-gray-500 mt-10">
        {{ $t('last-update') }}:
        {{ timeSince(user.lastUpdate) }}
      </div>
    </div>
  </DashboardContainer>
</template>

<style>
</style>
