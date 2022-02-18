import { Repository } from '../_Repository';
import { IUser, IUpdatePassword, IUpdateMasterPassword, IUpdateUserEmail } from './UserInterfaces';

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

export default {
  getUserInfo,
  updateEmail,
  updatePassword,
  updateMasterPassword
}
