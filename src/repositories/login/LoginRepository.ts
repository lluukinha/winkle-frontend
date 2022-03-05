import { Ref, ref } from 'vue';
import router from '../../router';
import i18n from '../../scripts/internacionalization/i18n';
import { showWarning } from '../../scripts/NotificationScript';
import { IResetPassword } from '../user/UserInterfaces';
import { PublicRepository, Repository } from '../_Repository';
import { ILoginForm } from "./ILoginForm";
import { ILoginInfo } from "./ILoginInfo";
import { IMasterPasswordConfig } from './IMasterPasswordConfig';
import * as dcodeIO from 'bcryptjs';
import SidebarScript from '../../scripts/SidebarScript';

const { t } = i18n.element.global;
const isRunningTimeout: Ref<boolean> = ref(false);
const isRunningTimeoutForMasterPassword: Ref<boolean> = ref(false);

const masterPasswordConfig = () : string | null => localStorage.getItem('master');
const loginInfo = () : string | null => localStorage.getItem('login');
const loginData = () : ILoginInfo | null => {
  if (loginTimeout()) return null;
  const info = loginInfo();
  return !info ? null : JSON.parse(info);
};

const removeLoginInfo = () : void => {
  localStorage.removeItem('login');
  localStorage.removeItem('master');
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

const setTimeoutToEraseMasterPassword = (expirationInSeconds: number) => {
  const minutes = Math.floor(expirationInSeconds / 60);
  const msg = `running timeout, cleaning masterPassword in ${minutes} minutes.`;
  console.warn(msg);
  const expiresIn = 1000 * expirationInSeconds;
  isRunningTimeoutForMasterPassword.value = true;

  setTimeout(() => {
    showWarning(
      t('master-password.timeout-title'),
      t('master-password.timeout-description', { count: 10 }),
      10000
    );
  }, expiresIn - 10000);

  setTimeout(() => removeMasterPassword, expiresIn);
};

const removeMasterPassword = () => {
  localStorage.removeItem('master');
  SidebarScript.toggleSidebar(false);
  isRunningTimeoutForMasterPassword.value = false;
};

const loginTimeout = () : boolean => {
  const info = loginInfo();
  const login = !info ? null : JSON.parse(info);
  if (!login) return true;
  const loginTime = new Date(login.last_login);
  const timeAfterTimeout = new Date(login.last_login);
  timeAfterTimeout.setSeconds(timeAfterTimeout.getSeconds() + login.expires_in);
  const currentTime = new Date();
  if (loginTime >= timeAfterTimeout || currentTime >= timeAfterTimeout) return true;

  if (!isRunningTimeout.value) {
    const diff = currentTime.getTime() - timeAfterTimeout.getTime();
    const secondsFromT1ToT2 = diff / 1000;
    const secondsBetweenDates = Math.abs(secondsFromT1ToT2);
    setTimeoutToLogout(secondsBetweenDates);
  }

  return false;
};

const masterPasswordTimeout = () : boolean => {
  const masterString = masterPasswordConfig();
  if (!masterString) return true;
  const masterPassword: IMasterPasswordConfig = JSON.parse(masterString);
  const loginTime = new Date(masterPassword.lastLogin);
  const timeAfterTimeout = new Date(masterPassword.lastLogin);
  timeAfterTimeout.setSeconds(timeAfterTimeout.getSeconds() + (masterPassword.minutesToExpire * 60));
  const currentTime = new Date();
  if (loginTime >= timeAfterTimeout || currentTime >= timeAfterTimeout) return true;

  if (!isRunningTimeoutForMasterPassword.value) {
    const diff = currentTime.getTime() - timeAfterTimeout.getTime();
    const secondsFromT1ToT2 = diff / 1000;
    const secondsBetweenDates = Math.abs(secondsFromT1ToT2);
    setTimeoutToEraseMasterPassword(secondsBetweenDates);
  }

  return false;
};

const canUseLoginInfo = () : boolean => {
  return loginInfo() !== null && !loginTimeout();
};

const canUseMasterPassword = () : boolean => {
  const config = masterPasswordConfig();
  return config !== null && !masterPasswordTimeout();
};

const setMasterPassword = async (config: IMasterPasswordConfig) : Promise<boolean> => {
  const login = loginData();
  if (!login) return false;

  setTimeoutToEraseMasterPassword(config.minutesToExpire * 60);
  const newHash = await dcodeIO.hash(config.masterPassword, 8);
  login.shuffled = newHash;
  localStorage.setItem('master', JSON.stringify(config));

  localStorage.removeItem('login');
  localStorage.setItem('login', JSON.stringify(login));
  return true;
};

const setMasterPasswordStringOnly = async (newMasterPassword: string) : Promise<boolean> => {
  const login = loginData();
  const master = masterPasswordConfig();
  if (!login || !master) return false;

  const newHash = await dcodeIO.hash(newMasterPassword, 8);
  login.shuffled = newHash;

  const config = JSON.parse(master);
  config.masterPassword = newMasterPassword;

  localStorage.removeItem('master');
  localStorage.setItem('master', JSON.stringify(config));

  localStorage.removeItem('login');
  localStorage.setItem('login', JSON.stringify(login));

  return true;
};

const getMasterPassword = () : string | null => {
  const masterString = masterPasswordConfig();
  if (!masterString) return null;
  const masterConfig = JSON.parse(masterString);
  return masterConfig.masterPassword || null;
}

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
  getMasterPassword,
  checkMasterPassword,
  forgotPassword,
  resetPassword,
  canUseMasterPassword,
  masterPasswordConfig,
  setMasterPasswordStringOnly,
  isRunningTimeoutForMasterPassword,
  removeMasterPassword
}
