<script setup lang="ts">
import DefaultSidebar from './sidebar/DefaultSidebar.vue';
import MobileSidebar from './sidebar/MobileSidebar.vue';

const items = [
  { name: 'Passwords', icon: 'passwords' },
  { name: 'Documents', icon: 'documents' },
  { name: 'Bank Accounts', icon: 'bank-accounts' },
  { name: 'Credit Cards', icon: 'credit-cards' },
  { name: 'Bitcoin Wallet', icon: 'wallet' },
  { name: 'Notes', icon: 'notes' },
];
</script>

<template>
  <DefaultSidebar :items="items" />
  <MobileSidebar :items="items" />
</template>
