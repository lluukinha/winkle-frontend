interface IUser {
  canUpdateMasterPassword: boolean;
  email: string;
  emailVerified: boolean;
  expirationDate: string;
  planName: string;
  id: string;
  lastUpdate: string;
  createdAt: string;
  name: string;
  type: 'users';
  admin: boolean;
}

interface IUserForm {
  name: string;
  email: string;
  plan: number;
  admin: boolean;
}

interface IUpdateUserEmail {
  email: string;
  confirmEmail: string;
  password: string;
}

interface IUpdatePassword {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface IUpdateMasterPassword {
  password: string;
  oldMasterPassword: string;
  newMasterPassword: string;
  confirmNewMasterPassword: string;
}

interface IResetPassword {
  token: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface IUserRegistration {
  name: string;
  area_code: number | null;
  phone: number | null;
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
  masterPassword: string;
  confirmMasterPassword: string;
};

interface IUserVerification {
  email: string;
  token: string;
}

export {
  IUser,
  IUpdateUserEmail,
  IUpdatePassword,
  IUpdateMasterPassword,
  IResetPassword,
  IUserRegistration,
  IUserVerification,
  IUserForm
}
