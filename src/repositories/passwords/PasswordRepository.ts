import AES from '../../scripts/AES';
import LoginRepository from '../login/LoginRepository';
import { Repository } from '../_Repository';
import { IPassword } from './IPassword';

const getPasswords = async () : Promise<IPassword[] | void> => {
  const master = LoginRepository.getMasterPassword();
  if (!master) return;

  const { data } = await Repository.get('/passwords');
  const passwords: IPassword[] = data.data;
  passwords.map((p: IPassword) => {
    if (p.login.length > 0) p.login = AES.aesDecrypt(p.login, master);
    if (p.password.length > 0) p.password = AES.aesDecrypt(p.password, master);
    return p;
  });

  return passwords;
};

const createPassword = async (p : IPassword) : Promise<IPassword | void> => {
  const master = LoginRepository.getMasterPassword();
  if (!master) return;
  if (p.login.length > 0) p.login = AES.aesEncrypt(p.login, master);
  if (p.password.length > 0) p.password = AES.aesEncrypt(p.password, master);

  const { data } = await Repository.post(`/passwords`, p);
  return data.data;
};

const updatePassword = async (p : IPassword) : Promise<IPassword | void> => {
  const master = LoginRepository.getMasterPassword();
  if (!master) return;
  if (p.login.length > 0) p.login = AES.aesEncrypt(p.login, master);
  if (p.password.length > 0) p.password = AES.aesEncrypt(p.password, master);

  const { data } = await Repository.put(`/passwords/${p.id}`, p);
  return data.data;
};

const removePassword = async (passwordId: number) : Promise<boolean> => {
  const response = await Repository.delete(`/passwords/${passwordId}`);
  return response.data;
};

export default {
  getPasswords,
  createPassword,
  updatePassword,
  removePassword
}
