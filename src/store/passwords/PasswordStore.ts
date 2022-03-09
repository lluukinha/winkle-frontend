import { ref, Ref } from "vue";
import FolderRepository from "../../repositories/folder/FolderRepository";
import { IFolder } from "../../repositories/folder/IFolder";
import { PasswordObject } from "../../repositories/passwords/IImportedPasswordResponse";
import { IPassword } from "../../repositories/passwords/IPassword";
import PasswordRepository from "../../repositories/passwords/PasswordRepository";
import showErrorMessage from "../../scripts/ErrorLogs";
import i18n from "../../scripts/internacionalization/i18n";
import { showNotification } from "../../scripts/NotificationScript";
import WinkleScripts from "../../scripts/WinkleScripts";

const { t } = i18n.element.global;
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

const removeData = () => {
  passwordsList.value = [];
  foldersList.value = [];
  listIsLoaded.value = false;
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
  FolderRepository.getFolders()
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
  showNotification(t('passwords.created'), password.name, 'success');
  checkAndIncludeFolder(password);
};

const includeFolderInList = (folder: IFolder) => {
  foldersList.value.push(folder);
  if (selectedFolderIds.value.length > 0) selectedFolderIds.value.push(folder.id);
  showNotification(t('passwords.folder-created'), folder.name, 'success');
};

const changeFolderInList = (folder: IFolder) => {
  const index = foldersList.value.findIndex((f) => f.id === folder.id);
  foldersList.value[index] = { ...folder };
};

const changePasswordInList = (password: IPassword) => {
  const index = passwordsList.value.findIndex((p) => p.id === password.id);
  passwordsList.value[index] = { ...password };
  showNotification(t('passwords.updated'), password.name, 'success');
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
  showNotification(t('passwords.removed'), '', 'success');
};

const removeFolder = (folderId: number) => {
  WinkleScripts.setLoading(true);
  FolderRepository.removeFolder(folderId)
    .then(() => { removeFolderFromList(folderId); })
    .catch(showErrorMessage)
    .finally(() => { WinkleScripts.setLoading(false); });
}

const removeFolderFromList = (folderId: number) => {
  const index = foldersList.value.findIndex((f) => Number(f.id) === folderId);
  if (index > -1) foldersList.value.splice(index, 1);
};

const sortByName = (a: IPassword | IFolder, b: IPassword | IFolder) => {
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
};

const saveFoldersFilter = (folderIds: string[]) => {
  selectedFolderIds.value = [ ...folderIds ];
};

const toggleAllFolders = () => {
  const newValue = !emptyFolderIsOpen.value;
  emptyFolderIsOpen.value = newValue;
  foldersList.value.map(f => f.isOpen = newValue);
};

const includeMany = (passwords: PasswordObject) => {
  const list = Object.values(passwords);
  list.forEach((p: IPassword) => checkAndIncludeFolder(p));
  passwordsList.value.push(...list);
};

const updateMany = (passwords: PasswordObject) => {
  Object.keys(passwords).forEach((key: string) => {
    const currentIndex = passwordsList.value
      .findIndex((p: IPassword) => p.name === key);
    checkAndIncludeFolder(passwords[key]);
    passwordsList.value[currentIndex] = passwords[key];
  });
};

export default {
  passwordsList,
  foldersList,
  selectedFolderIds,
  emptyFolderIsOpen,
  listIsLoaded,
  loadPasswords,
  loadFolders,
  includePasswordInList,
  changePasswordInList,
  removePasswordFromList,
  getAllData,
  saveFoldersFilter,
  toggleAllFolders,
  removeFolder,
  includeMany,
  updateMany,
  removeData,
  includeFolderInList,
  changeFolderInList
};
