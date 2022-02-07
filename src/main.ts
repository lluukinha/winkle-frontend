import { createApp } from 'vue';
import Notifications from '@kyvg/vue3-notification';
import App from './App.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import router from './router';
import './styles/index.css';
import i18n from './scripts/internacionalization/i18n';

createApp(App)
  .use(Notifications)
  .use(i18n.element)
  .use(router)
  .use(VueAxios, axios)
  .mount('#app');
