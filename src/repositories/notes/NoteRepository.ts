import { Repository } from '../_Repository';
import { INote } from './INote';

const list = async () : Promise<INote[]> => {
  const { data } = await Repository.get('/notes');
  return data.data;
};

const create = async (note: string) : Promise<INote> => {
  const { data } = await Repository.post(`/notes`, { note });
  return data.data;
};

const update = async (updatedNote: INote) : Promise<INote> => {
  const { data } = await Repository.put(`/notes/${updatedNote.id}`, { note: updatedNote.note });
  return data.data;
};

const remove = async (noteId: string) : Promise<boolean> => {
  const { data } = await Repository.delete(`/notes/${noteId}`);
  return data;
};

export default {
  list,
  create,
  update,
  remove
}
