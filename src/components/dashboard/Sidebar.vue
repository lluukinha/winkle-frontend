<script setup lang="ts">
import DefaultSidebar from './sidebar/DefaultSidebar.vue';
import MobileSidebar from './sidebar/MobileSidebar.vue';
import { ISidebarItem } from './sidebar/ISidebarItem';

const items : ISidebarItem[] = [
  { name: 'Passwords', icon: 'passwords', route: 'dashboard-passwords', disabled: false },
  { name: 'Documents', icon: 'documents', route: 'dashboard-documents', disabled: true },
  { name: 'Bank Accounts', icon: 'bank-accounts', route: 'dashboard-bankaccounts', disabled: true },
  { name: 'Credit Cards', icon: 'credit-cards', route: 'dashboard-creditcards', disabled: true },
  { name: 'Bitcoin Wallet', icon: 'wallet', route: 'dashboard-wallet', disabled: true },
  { name: 'Notes', icon: 'notes', route: 'dashboard-notes', disabled: true },
];
</script>

<template>
  <DefaultSidebar :items="items" />
  <MobileSidebar :items="items" />
</template>
