import { PublicRepository, Repository } from '../_Repository';
import { ILoginForm } from "./ILoginForm";
import { ILoginInfo } from "./ILoginInfo";

const loginInfo : string | null = localStorage.getItem('login');
const loginData : ILoginInfo | null = !loginInfo ? null : JSON.parse(loginInfo);

const setLoginInfo = (loginInfo: ILoginInfo) : void => {
  loginInfo.last_login = JSON.stringify(new Date());
  localStorage.setItem('login', JSON.stringify(loginInfo));
}

const removeLoginInfo = () : void => {
  localStorage.removeItem('login');
};

const doLogin = async (loginForm: ILoginForm): Promise<ILoginInfo> => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { data } = await PublicRepository.post(`${url}/api/auth/login`, loginForm);
  setLoginInfo(data);
  return data;
}

const doLogout = async () => {
  if (!loginData) {
    removeLoginInfo();
    return;
  }

  await Repository.post("auth/logout");
  removeLoginInfo();
}

const loginTimeout = () : boolean => {
  if (!loginData) return true;
  const loginTime = new Date(loginData.last_login);
  const timeAfterTimeout = new Date(loginData.last_login);
  timeAfterTimeout.setSeconds(timeAfterTimeout.getSeconds() + loginData.expires_in);
  if (loginTime >= timeAfterTimeout) return true;
  return false;
};

const canUseLoginInfo : boolean = loginInfo !== null && !loginTimeout();

export default {
  setLoginInfo,
  doLogin,
  doLogout,
  loginTimeout,
  removeLoginInfo,
  loginInfo,
  loginData,
  canUseLoginInfo
}
