import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import router from './router';
import './styles/index.css';
import i18n from './scripts/internacionalization/i18n';

createApp(App)
  .use(i18n.element)
  .use(router)
  .use(VueAxios, axios)
  .mount('#app');
