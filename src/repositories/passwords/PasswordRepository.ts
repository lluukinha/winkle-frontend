import AES from '../../scripts/AES';
import LoginRepository from '../login/LoginRepository';
import { Repository } from '../_Repository';
import { IFolder } from './IFolder';
import { IImportedPassword } from './IImportedPassword';
import { IImportedPasswordResponse } from './IImportedPasswordResponse';
import { IPassword } from './IPassword';

const getFolders = async () : Promise<IFolder[]> => {
  const { data } = await Repository.get('/passwords/folders');
  return data.data.map((folder: IFolder) => {
    folder.isOpen = true;
    return folder;
  });
};

const convertPasswords = (list: IImportedPassword[]) : IImportedPassword[] => {
  const master = LoginRepository.getMasterPassword() || '';
  return list.map((p: IImportedPassword) => {
    if (p.username && p.username.length > 0) {
      p.username = AES.aesEncrypt(p.username, master);
    }
    if (p.password && p.password.length > 0) {
      p.password = AES.aesEncrypt(p.password, master);
    }
    return p;
  });
};

const getPasswords = async () : Promise<IPassword[]> => {
  const master = LoginRepository.getMasterPassword() || '';
  const { data } = await Repository.get('/passwords');
  const passwords: IPassword[] = data.data;
  passwords.map((p: IPassword) => {
    if (p.login.length > 0) p.login = AES.aesDecrypt(p.login, master);
    if (p.password.length > 0) p.password = AES.aesDecrypt(p.password, master);
    return p;
  });

  return passwords;
};

const importCsv = async (passwords: IImportedPassword[]) : Promise<IImportedPasswordResponse> => {
  const master = LoginRepository.getMasterPassword() || '';
  const list = passwords
    .filter(p => p.name && p.name.length > 0)
    .map((p: IImportedPassword) => {
      return {
        name: p.name,
        description: 'Senha importada',
        login: p.username && p.username.length > 0
          ? AES.aesEncrypt(p.username, master)
          : '',
        password: p.password && p.password.length > 0
          ? AES.aesEncrypt(p.password, master)
          : '',
        url: p.url,
        folderName: p.folderName
      };
    });

  const { data } = await Repository.post(`/passwords/import`, { list });
  console.log({ data });
  return data;
};

const createPassword = async (p : IPassword) : Promise<IPassword> => {
  const master = LoginRepository.getMasterPassword() || '';
  const newPass = JSON.parse(JSON.stringify(p));
  if (newPass.login.length > 0) newPass.login = AES.aesEncrypt(p.login, master);
  if (newPass.password.length > 0) newPass.password = AES.aesEncrypt(p.password, master);

  const { data } = await Repository.post(`/passwords`, newPass);
  const ps: IPassword = data.data;
  if (ps.login.length > 0) ps.login = AES.aesDecrypt(ps.login, master);
  if (ps.password.length > 0) ps.password = AES.aesDecrypt(ps.password, master);
  return ps;
};

const updatePassword = async (p : IPassword) : Promise<IPassword> => {
  const master = LoginRepository.getMasterPassword() || '';
  const newPass = JSON.parse(JSON.stringify(p));
  if (newPass.login.length > 0) newPass.login = AES.aesEncrypt(p.login, master);
  if (newPass.password.length > 0) newPass.password = AES.aesEncrypt(p.password, master);

  const { data } = await Repository.put(`/passwords/${p.id}`, newPass);
  const ps: IPassword = data.data;
  if (ps.login.length > 0) ps.login = AES.aesDecrypt(ps.login, master);
  if (ps.password.length > 0) ps.password = AES.aesDecrypt(ps.password, master);
  return ps;
};

const removePassword = async (passwordId: number) : Promise<IFolder[]> => {
  const { data } = await Repository.delete(`/passwords/${passwordId}`);
  return data.data;
};

export default {
  getFolders,
  getPasswords,
  createPassword,
  updatePassword,
  removePassword,
  convertPasswords,
  importCsv
}
