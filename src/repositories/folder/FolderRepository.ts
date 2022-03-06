import { Repository } from '../_Repository';
import { IFolder } from './IFolder';

const getFolders = async () : Promise<IFolder[]> => {
  const { data } = await Repository.get('/folders');
  return data.data.map((folder: IFolder) => {
    folder.isOpen = true;
    return folder;
  });
};

const removeFolder = async (folderId: number) : Promise<boolean> => {
  const { data } = await Repository.delete(`/folders/${folderId}`);
  return data;
};

export default {
  getFolders,
  removeFolder
}

