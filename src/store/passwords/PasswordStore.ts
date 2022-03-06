import { ref, Ref } from "vue";
import { IFolder } from "../../repositories/passwords/IFolder";
import { IPassword } from "../../repositories/passwords/IPassword";
import PasswordRepository from "../../repositories/passwords/PasswordRepository";
import showErrorMessage from "../../scripts/ErrorLogs";
import WinkleScripts from "../../scripts/WinkleScripts";

const passwordsList: Ref<IPassword[]> = ref([]);
const foldersList: Ref<IFolder[]> = ref([]);
const listIsLoaded: Ref<boolean> = ref(false);
const selectedFolderIds: Ref<string[]> = ref([]);
const emptyFolderIsOpen: Ref<boolean> = ref(true);

const getAllData = (forceLoad: boolean = false) => {
  if (!listIsLoaded.value || forceLoad) {
    loadFolders();
    loadPasswords();
    listIsLoaded.value = true;
  }
};

const loadPasswords = () => {
  WinkleScripts.setLoading(true);
  PasswordRepository.getPasswords()
    .then((result: IPassword[]) => {
      passwordsList.value = result.sort(sortByName);
    })
    .catch(showErrorMessage)
    .finally(() => {
      WinkleScripts.setLoading(false);
    });
};

const loadFolders = () => {
  WinkleScripts.setLoading(true);
  PasswordRepository.getFolders()
    .then((result: IFolder[]) => {
      foldersList.value = result.sort(sortByName);
      const folderIds: string[] = result.map(f => f.id);
      selectedFolderIds.value = selectedFolderIds.value.filter(id => folderIds.includes(id));
    })
    .catch(showErrorMessage)
    .finally(() => {
      WinkleScripts.setLoading(false);
    });
};

const includePasswordInList = (password: IPassword) => {
  passwordsList.value.push(password);
  checkAndIncludeFolder(password);
};

const changePasswordInList = (password: IPassword) => {
  const index = passwordsList.value.findIndex((p) => p.id === password.id);
  passwordsList.value[index] = { ...password };
  checkAndIncludeFolder(password);
};

const checkAndIncludeFolder = (password: IPassword) => {
  const hasFolder = password.folder.id !== '';
  const folderIds: string[] = foldersList.value.map(f => f.id);
  if (hasFolder && !folderIds.includes(password.folder.id)) {
    const newFolder = password.folder;
    newFolder.isOpen = true;
    foldersList.value.push(newFolder);
    foldersList.value = foldersList.value.sort(sortByName);
  }
};

const removePasswordFromList = (passwordId: number) => {
  const index = passwordsList.value.findIndex((p) => Number(p.id) === passwordId);
  if (index > -1) passwordsList.value.splice(index, 1);
};

const sortByName = (a: IPassword | IFolder, b: IPassword | IFolder) => {
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
};

const saveFoldersFilter = (folderIds: string[]) => {
  selectedFolderIds.value = [ ...folderIds ];
};

const toggleAllFolders = (willShow: boolean) => {
  emptyFolderIsOpen.value = willShow;
  foldersList.value.map(f => f.isOpen = willShow);
};

export default {
  passwordsList,
  foldersList,
  selectedFolderIds,
  emptyFolderIsOpen,
  loadPasswords,
  loadFolders,
  includePasswordInList,
  changePasswordInList,
  removePasswordFromList,
  getAllData,
  saveFoldersFilter,
  toggleAllFolders
};
