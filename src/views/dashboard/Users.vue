<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import DashboardHeader from "../../components/shared/DashboardHeader.vue";
import DashboardContainer from "../../components/shared/DashboardContainer.vue";
import UserStore from "../../store/user/UserStore";
import WinkleScripts from "../../scripts/WinkleScripts";
import { IUser } from "../../repositories/user/UserInterfaces";
import router from "../../router";
import UserRepository from "../../repositories/user/UserRepository";
import showErrorMessage from "../../scripts/ErrorLogs";
import VerifiedIcon from "../../components/icons/VerifiedIcon.vue";
import WinkleButton from "../../components/shared/WinkleButton.vue";
import CreateNew from "../../components/users/CreateNew.vue";

const users : Ref<IUser[]> = ref([]);

const checkAccessToThisScreen = (user: IUser) : boolean => {
  if (!user.admin) {
    console.log('not allowed');
    router.push({ name: 'home' })
    return false;
  }

  loadUsers();
  return true;
}

const loadUsers = () => {
  WinkleScripts.setLoading(true);
  UserRepository.listUsers()
    .then((result: IUser[]) => {
      users.value = result;
    })
    .catch(showErrorMessage)
    .finally(() => {
      WinkleScripts.setLoading(false);
    })
};

onMounted(async () => {
  if (UserStore.user.value) {
    checkAccessToThisScreen(UserStore.user.value);
  }
});
</script>

<template>
  <CreateNew />
  <DashboardHeader :title="$t('users.title')" />
  <DashboardContainer>
    <div class="w-full flex items-center justify-between md:mt-2 mb-6">
      <div class="flex items-center">
        <WinkleButton class="mr-1 flex items-center" size="sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span class="hidden md:block">
            {{ $t('users.create') }}
          </span>
        </WinkleButton>
      </div>
    </div>
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">{{ $t('users.table.name') }}</th>
          <th scope="col" class="px-6 py-3">{{ $t('users.table.plan') }}</th>
          <th scope="col" class="px-6 py-3">{{ $t('users.table.created') }}</th>
          <th scope="col" class="px-6 py-3">{{ $t('users.table.expires') }}</th>
          <th scope="col" class="px-6 py-3">{{ $t('users.table.admin') }}</th>
          <th scope="col" class="px-6 py-3">
            <span class="sr-only">{{ $t('users.table.edit') }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
	      <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
		    <span class="text-gray-900 dark:text-white">{{ user.name }}</span><br>
            {{ user.email }}
            <span class="text-xs italic text-red-500 dark:text-red-300" v-if="!user.emailVerified">(não verificado)</span>
		  </th>
          <td class="px-6 py-4">{{ user.planName }}</td>
          <td class="px-6 py-4">{{ WinkleScripts.timeSince(new Date(user.createdAt)) }}</td>
          <td class="px-6 py-4">{{ WinkleScripts.timeTo(new Date(user.expirationDate)) }}</td>
          <td class="px-6 py-4">
            <VerifiedIcon :checked="user.admin" />
          </td>
          <td class="px-6 py-4 text-right">
            <button type="button" class="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              {{ $t('users.table.edit') }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </DashboardContainer>
</template>

<style lang="postcss" scoped>
</style>
