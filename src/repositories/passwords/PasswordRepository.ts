import { Repository } from '../_Repository';

const getPasswords = async () => {
  const { data } = await Repository.get('/passwords');
  return data;
};

export default {
  getPasswords,
}
