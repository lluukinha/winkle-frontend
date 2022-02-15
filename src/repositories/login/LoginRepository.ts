import router from '../../router';
import { PublicRepository, Repository } from '../_Repository';
import { ILoginForm } from "./ILoginForm";
import { ILoginInfo } from "./ILoginInfo";

const loginInfo = () : string | null => localStorage.getItem('login');
const loginData = () : ILoginInfo | null => {
  const info = loginInfo();
  return !info ? null : JSON.parse(info);
};

const removeLoginInfo = () : void => localStorage.removeItem('login');

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
  setTimeout(() => { router.push({ name: 'logout' }); }, expiresIn);
};

const loginTimeout = () : boolean => {
  const login = loginData();
  if (!login) return true;
  const loginTime = new Date(login.last_login);
  const timeAfterTimeout = new Date(login.last_login);
  timeAfterTimeout.setSeconds(timeAfterTimeout.getSeconds() + login.expires_in);
  if (loginTime >= timeAfterTimeout) return true;
  return false;
};

const canUseLoginInfo = () : boolean => loginInfo !== null && !loginTimeout();

const setMasterPassword = (password: string) : void => {
  localStorage.setItem('masterPassword', password);
};

const getMasterPassword = () : string | null => {
  return localStorage.getItem('masterPassword');
}

export default {
  doLogin,
  loginTimeout,
  removeLoginInfo,
  loginInfo,
  loginData,
  canUseLoginInfo,
  setMasterPassword,
  getMasterPassword,
}
