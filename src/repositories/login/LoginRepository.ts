import { Ref, ref } from 'vue';
import router from '../../router';
import i18n from '../../scripts/internacionalization/i18n';
import { showWarning } from '../../scripts/NotificationScript';
import { IResetPassword } from '../user/UserInterfaces';
import { PublicRepository, Repository } from '../_Repository';
import { ILoginForm } from "./ILoginForm";
import { ILoginInfo } from "./ILoginInfo";
import { IMasterPasswordConfig } from './IMasterPasswordConfig';

const { t } = i18n.element.global;
const isRunningTimeout: Ref<boolean> = ref(false);
const isRunningTimeoutForMasterPassword: Ref<boolean> = ref(false);
const isMasterPasswordInserted: Ref<boolean> = ref(false);
const masterPasswordConfig: Ref<IMasterPasswordConfig | null> = ref(null);

const loginInfo = () : string | null => localStorage.getItem('login');
const loginData = () : ILoginInfo | null => {
  const info = loginInfo();
  return !info ? null : JSON.parse(info);
};

const removeLoginInfo = () : void => {
  localStorage.removeItem('login');
  masterPasswordConfig.value = null;
  isMasterPasswordInserted.value = false;
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

const setTimeoutToLogout = (expiration: number) => {
  console.log('running timeout, logout in ' + expiration + ' seconds');
  const expiresIn = 1000 * expiration;
  isRunningTimeout.value = true;
  setTimeout(() => {
    router.push({ name: 'logout' });
    isRunningTimeout.value = false;
  }, expiresIn);
};

const setTimeoutToEraseMasterPassword = (expiration: number) => {
  console.log('running timeout, cleaning masterPassword in ' + expiration + ' seconds');
  const expiresIn = 1000 * expiration;
  isRunningTimeoutForMasterPassword.value = true;

  setTimeout(() => {
    showWarning(
      t('master-password.timeout-title'),
      t('master-password.timeout-description', { count: 10 }),
      10000
    );
  }, expiresIn - 10000);

  setTimeout(() => {
    masterPasswordConfig.value = null;
    isMasterPasswordInserted.value = false;
    isRunningTimeoutForMasterPassword.value = false;
  }, expiresIn);
};

const loginTimeout = () : boolean => {
  const login = loginData();
  if (!login) return true;
  const loginTime = new Date(login.last_login);
  const timeAfterTimeout = new Date(login.last_login);
  timeAfterTimeout.setSeconds(timeAfterTimeout.getSeconds() + login.expires_in);
  if (loginTime >= timeAfterTimeout) return true;

  if (!isRunningTimeout.value) {
    const diff = new Date().getTime() - timeAfterTimeout.getTime();
    const secondsFromT1ToT2 = diff / 1000;
    const secondsBetweenDates = Math.abs(secondsFromT1ToT2);
    setTimeoutToLogout(secondsBetweenDates);
  }

  return false;
};

const masterPasswordTimeout = () : boolean => {
  if (!masterPasswordConfig.value) return true;
  const masterPassword: IMasterPasswordConfig = masterPasswordConfig.value;
  const loginTime = new Date(masterPassword.lastLogin);
  const timeAfterTimeout = new Date(masterPassword.lastLogin);
  timeAfterTimeout.setSeconds(timeAfterTimeout.getSeconds() + (masterPassword.minutesToExpire * 60));
  if (loginTime >= timeAfterTimeout) return true;

  if (!isRunningTimeoutForMasterPassword.value) {
    const diff = new Date().getTime() - timeAfterTimeout.getTime();
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
  return !masterPasswordTimeout();
};

const setMasterPassword = (config: IMasterPasswordConfig) : void => {
  setTimeoutToEraseMasterPassword(config.minutesToExpire * 60);
  isMasterPasswordInserted.value = true;
  masterPasswordConfig.value = config;
};

const getMasterPassword = () : string | null => {
  return masterPasswordConfig.value?.masterPassword || null;
}

const checkMasterPassword = async (master: string) : Promise<boolean> => {
  const { data } = await Repository.post('/auth/checkMasterPassword', { master });
  return data;
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
  isMasterPasswordInserted
}
