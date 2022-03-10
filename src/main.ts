import { createApp } from 'vue';
import Notifications from '@kyvg/vue3-notification';
import App from './App.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import router from './router';
import i18n from './scripts/internacionalization/i18n';
import ContextMenu from '@imengyu/vue3-context-menu';

import './styles/index.css';
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';

createApp(App)
  .use(Notifications)
  .use(i18n.element)
  .use(ContextMenu)
  .use(router)
  .use(VueAxios, axios)
  .mount('#app');
