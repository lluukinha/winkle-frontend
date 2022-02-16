import { ref } from 'vue';
import router from '../../router';
import { PublicRepository, Repository } from '../_Repository';
import { ILoginForm } from "./ILoginForm";
import { ILoginInfo } from "./ILoginInfo";

const isRunningTimeout = ref(false);

const loginInfo = () : string | null => localStorage.getItem('login');
const loginData = () : ILoginInfo | null => {
  const info = loginInfo();
  return !info ? null : JSON.parse(info);
};

const removeLoginInfo = () : void => {
  localStorage.removeItem('login');
  localStorage.removeItem('masterPassword');
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

const setTimeoutToLogout = (expiration: number) => {
  // 1000 = 1 second
  const expiresIn = 1000 * expiration;
  isRunningTimeout.value = true;
  setTimeout(() => {
    router.push({ name: 'logout' });
    isRunningTimeout.value = false;
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
    const dif = new Date().getTime() - timeAfterTimeout.getTime();
    const secondsFromT1ToT2 = dif / 1000;
    const secondsBetweenDates = Math.abs(secondsFromT1ToT2);
    setTimeoutToLogout(secondsBetweenDates);
    console.log('running timeout, logout in ' + secondsBetweenDates + ' seconds');
  }

  return false;
};

const canUseLoginInfo = () : boolean => {
  return loginInfo !== null && !loginTimeout();
};

const setMasterPassword = (password: string) : void => {
  localStorage.setItem('masterPassword', password);
};

const getMasterPassword = () : string | null => {
  return localStorage.getItem('masterPassword');
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
}
