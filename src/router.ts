import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Logout from './views/Logout.vue';
import Dashboard from './views/Dashboard.vue';
import Passwords from './views/dashboard/Passwords.vue';
import User from './views/dashboard/User.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/login', name: 'login', component: Login },
    { path: '/logout', name: 'logout', component: Logout },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      children: [
        {
          path: 'passwords',
          name: 'dashboard-passwords',
          component: Passwords,
        },
        {
          path: 'user',
          name: 'dashboard-user',
          component: User,
        }
      ],
    }
  ]
});

export default router;
