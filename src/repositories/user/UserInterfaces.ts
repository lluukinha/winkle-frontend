interface IUser {
  canUpdateMasterPassword: boolean;
  email: string;
  emailVerified: boolean;
  id: string;
  lastUpdate: string;
  createdAt: string;
  name: string;
  type: 'users';
}

interface IUpdateUserEmail {
  email: string;
  confirmEmail: string;
  password: string;
}

interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

interface IUpdateMasterPassword {
  password: string;
  oldMasterPassword: string;
  newMasterPassword: string;
}

export {
  IUser,
  IUpdateUserEmail,
  IUpdatePassword,
  IUpdateMasterPassword
}
