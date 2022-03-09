import { Ref, ref } from 'vue';
import router from '../../router';
import { IResetPassword } from '../user/UserInterfaces';
import { PublicRepository, Repository } from '../_Repository';
import { ILoginForm } from "./ILoginForm";
import { ILoginInfo } from "./ILoginInfo";
import * as dcodeIO from 'bcryptjs';
import SidebarScript from '../../scripts/SidebarScript';
import UserStore from '../../store/user/UserStore';
import PasswordStore from '../../store/passwords/PasswordStore';

const isRunningTimeout: Ref<boolean> = ref(false);
const masterPassword: Ref<string | null> = ref(localStorage.getItem('master'));

const loginInfo = () : string | null => localStorage.getItem('login');
const loginData = () : ILoginInfo | null => {
  if (loginTimeout()) return null;
  const info = loginInfo();
  return !info ? null : JSON.parse(info);
};

const removeLoginInfo = () : void => {
  localStorage.removeItem('login');
  localStorage.removeItem('master');
  masterPassword.value = null;
  UserStore.removeUserData();
  PasswordStore.removeData();
}

const doLogin = async (loginForm: ILoginForm): Promise<ILoginInfo> => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { data } = await PublicRepository.post(`${url}/api/auth/login`, loginForm);
  data.last_login = new Date();
  data.login = loginForm.email;
  setTimeoutToLogout(data.expires_in);
  localStorage.setItem('login', JSON.stringify(data));
  return data;
}

const forgotPassword = async (email: string): Promise<boolean> => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { data } = await PublicRepository.post(`${url}/api/forgot-password`, { email });
  return data.data;
};

const resetPassword = async (form: IResetPassword): Promise<boolean> => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { data } = await PublicRepository.post(`${url}/api/reset-password`, form);
  return data.data;
};

const setTimeoutToLogout = (expirationInSeconds: number) => {
  const minutes = Math.floor(expirationInSeconds / 60);
  const msg = `running timeout, logout in ${minutes} minutes.`;
  console.warn(msg);
  const expiresIn = 1000 * expirationInSeconds;
  isRunningTimeout.value = true;
  setTimeout(() => {
    router.push({ name: 'logout' });
    isRunningTimeout.value = false;
  }, expiresIn);
};

const removeMasterPassword = () => {
  localStorage.removeItem('master');
  masterPassword.value = null;
  UserStore.removeUserData();
  PasswordStore.removeData();
  SidebarScript.toggleSidebar(false);
};

const loginTimeout = () : boolean => {
  const info = loginInfo();
  const login: ILoginInfo | null = info ? JSON.parse(info) : null;
  if (!login) {
    removeLoginInfo();
    return true;
  }
  const loginTime = new Date(login.last_login);
  const timeAfterTimeout = new Date(login.last_login);
  timeAfterTimeout.setSeconds(timeAfterTimeout.getSeconds() + login.expires_in);
  const currentTime = new Date();
  if (loginTime >= timeAfterTimeout || currentTime >= timeAfterTimeout) {
    removeLoginInfo();
    return true;
  }

  if (!isRunningTimeout.value) {
    const diff = currentTime.getTime() - timeAfterTimeout.getTime();
    const secondsFromT1ToT2 = diff / 1000;
    const secondsBetweenDates = Math.abs(secondsFromT1ToT2);
    setTimeoutToLogout(secondsBetweenDates);
  }

  return false;
};

const canUseLoginInfo = () : boolean => {
  return loginInfo() !== null && !loginTimeout();
};

const canUseMasterPassword = () : boolean => {
  const master = masterPassword.value || '';
  return master !== null;
};

const setMasterPassword = async (master: string) : Promise<boolean> => {
  const login = loginData();
  if (!login) return false;

  const newHash = await dcodeIO.hash(master, 8);
  login.shuffled = newHash;
  localStorage.removeItem('master');
  localStorage.setItem('master', master);
  masterPassword.value = master;

  localStorage.removeItem('login');
  localStorage.setItem('login', JSON.stringify(login));
  return true;
};

const checkMasterPassword = async (master: string) : Promise<boolean> => {
  const masterPass = loginData();
  if (!masterPass) return false;
  const result = await dcodeIO.compare(master, masterPass.shuffled);
  return result;
};

export default {
  doLogin,
  loginTimeout,
  removeLoginInfo,
  loginInfo,
  loginData,
  canUseLoginInfo,
  setMasterPassword,
  checkMasterPassword,
  forgotPassword,
  resetPassword,
  canUseMasterPassword,
  removeMasterPassword,
  masterPassword,
}
