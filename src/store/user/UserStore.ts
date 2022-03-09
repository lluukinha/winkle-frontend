import { computed, ref, Ref } from "vue";
import { IUser } from "../../repositories/user/UserInterfaces";
import UserRepository from "../../repositories/user/UserRepository";
import showErrorMessage from "../../scripts/ErrorLogs";
import WinkleScripts from "../../scripts/WinkleScripts";
import PasswordStore from "../passwords/PasswordStore";

const user: Ref<IUser | undefined> = ref();
const userIsLoaded: Ref<boolean> = ref(false);

const getUserData = async () => {
  if (userIsLoaded.value) return;
  WinkleScripts.setLoading(true);
  UserRepository.getUserInfo()
    .then((userData) => {
      user.value = userData;
      userIsLoaded.value = true;
    })
    .catch(showErrorMessage)
    .finally(() => { WinkleScripts.setLoading(false); });
};

const updateUserData = (updatedUser: IUser) => {
  user.value = updatedUser;
};

const removeUserData = () => {
  user.value = undefined;
  userIsLoaded.value = false;
};

const canUpdateMasterPassword = computed(() => {
  if (!user.value) return false;
  const canUpdateFromUserData = user.value?.canUpdateMasterPassword;
  const isPasswordsLoaded = PasswordStore.listIsLoaded.value;

  if (!isPasswordsLoaded) return canUpdateFromUserData;
  const passwordsHasData = PasswordStore.passwordsList.value
    .some(p => p.login.length > 0 || p.password.length > 0);

  return !passwordsHasData;
});

const timeSince = (time: string) => WinkleScripts.timeSince(new Date(time));
const timeTo = (time: string) => WinkleScripts.timeTo(new Date(time));

export default {
  user,
  canUpdateMasterPassword,
  getUserData,
  updateUserData,
  timeSince,
  timeTo,
  removeUserData
}
