import { Ref, ref } from 'vue';
import { IResetPassword } from '../user/UserInterfaces';
import { PublicRepository, Repository } from '../_Repository';
import { ILoginForm } from './ILoginForm';
import { ILoginInfo } from './ILoginInfo';
import SidebarScript from '../../scripts/SidebarScript';
import UserStore from '../../store/user/UserStore';
import PasswordStore from '../../store/passwords/PasswordStore';

const isRefreshed: Ref<boolean> = ref(false);
const masterPassword: Ref<string | null> = ref(null);
const loginInfo: Ref<string | null> = ref(localStorage.getItem('login'));
const loginData: Ref<ILoginInfo | null> = ref(
  loginInfo.value ? JSON.parse(loginInfo.value) : null
);

const checkLoginTimeout = (): boolean => {
  if (!loginData.value) {
    removeLoginInfo();
    return true;
  }

  const loginTime = new Date(loginData.value.last_login);
  const timeAfterTimeout = new Date(loginData.value.last_login);
  timeAfterTimeout.setSeconds(
    timeAfterTimeout.getSeconds() + loginData.value.expires_in
  );
  const currentTime = new Date();
  if (loginTime >= timeAfterTimeout || currentTime >= timeAfterTimeout) {
    removeLoginInfo();
    return true;
  }

  return false;
};

const removeLoginInfo = (): void => {
  localStorage.removeItem('login');
  localStorage.removeItem('master');
  loginInfo.value = null;
  loginData.value = null;
  masterPassword.value = null;
  UserStore.removeUserData();
  PasswordStore.removeData();
};

const doLogin = async (loginForm: ILoginForm): Promise<ILoginInfo> => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { data } = await PublicRepository.post(
    `${url}/api/auth/login`,
    loginForm
  );
  data.last_login = new Date();
  data.login = loginForm.email;
  localStorage.setItem('login', JSON.stringify(data));
  loginInfo.value = localStorage.getItem('login');
  loginData.value = data;
  isRefreshed.value = true;
  return data;
};

const forgotPassword = async (email: string): Promise<boolean> => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { data } = await PublicRepository.post(`${url}/api/forgot-password`, {
    email,
  });
  return data.data;
};

const resetPassword = async (form: IResetPassword): Promise<boolean> => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { data } = await PublicRepository.post(
    `${url}/api/reset-password`,
    form
  );
  return data.data;
};

const removeMasterPassword = () => {
  masterPassword.value = null;
  UserStore.removeUserData();
  PasswordStore.removeData();
  SidebarScript.toggleSidebar(false);
};

const refreshUser = async (): Promise<ILoginInfo | void> => {
  const currentLoginData = loginData.value;
  if (!currentLoginData) return;
  const { data } = await Repository.post('/auth/refresh');
  data.last_login = new Date();
  data.login = currentLoginData.login;
  localStorage.setItem('login', JSON.stringify(data));
  loginInfo.value = JSON.stringify(data);
  loginData.value = JSON.parse(JSON.stringify(data));
  isRefreshed.value = true;
  if (!UserStore.user.value) await UserStore.getUserData();
  return data;
};

const canUseMasterPassword = (): boolean => {
  return masterPassword.value !== null;
};

const setMasterPassword = async (master: string): Promise<boolean> => {
  if (!loginData.value) return false;
  masterPassword.value = master;
  return true;
};

const checkMasterPassword = async (password: string): Promise<boolean> => {
  if (!loginData.value) return false;
  const checked = await Repository.post('/auth/checkMasterPassword', {
    password,
  });
  return checked.data;
};

export default {
  loginData,
  masterPassword,
  isRefreshed,
  refreshUser,
  checkLoginTimeout,
  doLogin,
  removeLoginInfo,
  setMasterPassword,
  checkMasterPassword,
  forgotPassword,
  resetPassword,
  canUseMasterPassword,
  removeMasterPassword,
};
