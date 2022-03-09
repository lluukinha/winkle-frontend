import AES from '../../scripts/AES';
import { IFolder } from '../folder/IFolder';
import LoginRepository from '../login/LoginRepository';
import { Repository } from '../_Repository';
import { IImportedPassword } from './IImportedPassword';
import { IImportedPasswordResponse } from './IImportedPasswordResponse';
import { IPassword } from './IPassword';

const convertPasswords = (list: IImportedPassword[]) : IImportedPassword[] => {
  const master = LoginRepository.masterPassword.value || '';
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
  const master = LoginRepository.masterPassword.value || '';
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
  const master = LoginRepository.masterPassword.value || '';
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
  return mapDataFromImportedResults(data, master);
};

const mapDataFromImportedResults = (data: IImportedPasswordResponse, master: string) : IImportedPasswordResponse => {
  Object.keys(data.created).forEach((name: string) => {
    const currentLogin = data.created[name].login;
    const currentPassword = data.created[name].password;

    data.created[name].login = currentLogin && currentLogin.length > 0
      ? AES.aesDecrypt(currentLogin, master)
      : '';
    data.created[name].password = currentPassword && currentPassword.length > 0
      ? AES.aesDecrypt(currentPassword, master)
      : '';
  });

  Object.keys(data.updated).forEach((name: string) => {
    const currentLogin = data.updated[name].login;
    const currentPassword = data.updated[name].password;

    data.updated[name].login = currentLogin && currentLogin.length > 0
      ? AES.aesDecrypt(currentLogin, master)
      : '';
    data.updated[name].password = currentPassword && currentPassword.length > 0
      ? AES.aesDecrypt(currentPassword, master)
      : '';
  });

  return data;
};

const createFolder = async (name: string) : Promise<IFolder> => {
  const { data } = await Repository.post('/folders', { name });
  return data.data;
};

const updateFolder = async (id: string, name: string) : Promise<IFolder> => {
  const { data } = await Repository.put(`/folders/${id}`, { name });
  return data.data;
};

const changeFolder = async (id: string, folderId: string) : Promise<IPassword> => {
  const { data } = await Repository.put(`/passwords/${id}/folder/${folderId}`);
  return data.data;
};

const createPassword = async (p: IPassword) : Promise<IPassword> => {
  const master = LoginRepository.masterPassword.value || '';
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
  const master = LoginRepository.masterPassword.value || '';
  const newPass = JSON.parse(JSON.stringify(p));
  if (newPass.login.length > 0) newPass.login = AES.aesEncrypt(p.login, master);
  if (newPass.password.length > 0) newPass.password = AES.aesEncrypt(p.password, master);

  const { data } = await Repository.put(`/passwords/${p.id}`, newPass);
  const ps: IPassword = data.data;
  if (ps.login.length > 0) ps.login = AES.aesDecrypt(ps.login, master);
  if (ps.password.length > 0) ps.password = AES.aesDecrypt(ps.password, master);
  return ps;
};

const removePassword = async (passwordId: number) : Promise<boolean> => {
  const { data } = await Repository.delete(`/passwords/${passwordId}`);
  return data;
};

export default {
  getPasswords,
  createPassword,
  updatePassword,
  removePassword,
  convertPasswords,
  importCsv,
  createFolder,
  updateFolder,
  changeFolder
}
