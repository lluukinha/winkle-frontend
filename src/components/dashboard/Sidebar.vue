<script setup lang="ts">
import LoginRepository from "../../repositories/login/LoginRepository";
import DefaultSidebar from './sidebar/DefaultSidebar.vue';
import MobileSidebar from './sidebar/MobileSidebar.vue';
import { ISidebarItem } from './sidebar/ISidebarItem';
import { ILoginInfo } from "../../repositories/login/ILoginInfo";
import SidebarScript from "../../scripts/SidebarScript";
import i18n from "../../scripts/internacionalization/i18n";

const { t } = i18n.element.global;
const loginData : ILoginInfo | null = LoginRepository.loginData();
const userLogin = loginData ? loginData.login : '';

const items : ISidebarItem[] = [
  { name: t('passwords.title'), icon: 'passwords', route: 'dashboard-passwords', disabled: false },
  /* { name: t('documents.title'), icon: 'documents', route: 'dashboard-documents', disabled: true },
  { name: t('bank-accounts.title'), icon: 'bank-accounts', route: 'dashboard-bankaccounts', disabled: true },
  { name: t('credit-cards.title'), icon: 'credit-cards', route: 'dashboard-creditcards', disabled: true },
  { name: t('bitcoin-wallet.title'), icon: 'wallet', route: 'dashboard-wallet', disabled: true },
  { name: t('notes.title'), icon: 'notes', route: 'dashboard-notes', disabled: true }, */
];
</script>

<template>
  <DefaultSidebar :items="items" :userLogin="userLogin" />
  <MobileSidebar :items="items" :userLogin="userLogin" :isOpen="SidebarScript.isOpen.value" />
</template>
