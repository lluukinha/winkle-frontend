import { Repository } from '../_Repository';
import { IPassword } from './IPassword';

const getPasswords = async () : Promise<IPassword[]> => {
  const { data } = await Repository.get('/passwords');
  return data.data;
};

const createPassword = async (p : IPassword) : Promise<IPassword> => {
  const { data } = await Repository.post(`/passwords`, p);
  return data.data;
};

const updatePassword = async (p : IPassword) : Promise<IPassword> => {
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
