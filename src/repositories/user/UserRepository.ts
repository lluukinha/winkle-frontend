import { PublicRepository, Repository } from '../_Repository';
import { IUser, IUpdatePassword, IUpdateMasterPassword, IUpdateUserEmail, IUserVerification, IUserRegistration } from './UserInterfaces';

const getUserInfo = async () : Promise<IUser> => {
  const { data } = await Repository.get('/user');
  return data.data
};

const updateEmail = async (payload: IUpdateUserEmail) : Promise<IUser> => {
  const { data } = await Repository.put('/user/email', payload);
  return data.data;
};

const updatePassword = async (payload: IUpdatePassword) : Promise<IUser> => {
  const { data } = await Repository.put('/user/password', payload);
  return data.data;
};

const updateMasterPassword = async (payload: IUpdateMasterPassword) : Promise<IUser> => {
  const { data } = await Repository.put('/user/masterPassword', payload);
  return data.data;
}

const verifyUserRegistration = async (payload: IUserVerification): Promise<boolean> => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { data } = await PublicRepository.post(`${url}/api/verify-registration`, payload);
  return data.data;
};

const finishRegistration = async (payload: IUserRegistration): Promise<boolean> => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { data } = await PublicRepository.post(`${url}/api/finish-registration`, payload);
  return data.data;
};

const listUsers = async () : Promise<IUser[]> => {
  const { data } = await Repository.get('/user/list');
  return data.data;
}

export default {
  getUserInfo,
  updateEmail,
  updatePassword,
  updateMasterPassword,
  verifyUserRegistration,
  finishRegistration,
  listUsers
}
