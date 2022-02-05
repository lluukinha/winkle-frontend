import { PublicRepository, Repository } from '../_Repository';
import { ILoginForm } from "./ILoginForm";
import { ILoginInfo } from "./ILoginInfo";

const loginInfo = () : string | null => localStorage.getItem('login');
const loginData = () : ILoginInfo | null => {
  const info = loginInfo();
  return !info ? null : JSON.parse(info);
};

const setLoginInfo = (loginInfo: ILoginInfo) : void => {
  loginInfo.last_login = JSON.stringify(new Date());
  localStorage.setItem('login', JSON.stringify(loginInfo));
}

const removeLoginInfo = () : void => localStorage.removeItem('login');

const doLogin = async (loginForm: ILoginForm): Promise<ILoginInfo> => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { data } = await PublicRepository.post(`${url}/api/auth/login`, loginForm);
  setLoginInfo(data);
  return data;
}

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

export default {
  setLoginInfo,
  doLogin,
  loginTimeout,
  removeLoginInfo,
  loginInfo,
  loginData,
  canUseLoginInfo
}
