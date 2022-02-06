<script setup lang="ts">
import DefaultSidebar from './sidebar/DefaultSidebar.vue';
import MobileSidebar from './sidebar/MobileSidebar.vue';
import { ISidebarItem } from './sidebar/ISidebarItem';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const items : ISidebarItem[] = [
  { name: t('passwords.title'), icon: 'passwords', route: 'dashboard-passwords', disabled: false },
  { name: t('documents.title'), icon: 'documents', route: 'dashboard-documents', disabled: true },
  { name: t('bank-accounts.title'), icon: 'bank-accounts', route: 'dashboard-bankaccounts', disabled: true },
  { name: t('credit-cards.title'), icon: 'credit-cards', route: 'dashboard-creditcards', disabled: true },
  { name: t('bitcoin-wallet.title'), icon: 'wallet', route: 'dashboard-wallet', disabled: true },
  { name: t('notes.title'), icon: 'notes', route: 'dashboard-notes', disabled: true },
];
</script>

<template>
  <DefaultSidebar :items="items" />
  <MobileSidebar :items="items" />
</template>
