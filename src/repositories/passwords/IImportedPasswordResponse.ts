import { IPassword } from "./IPassword";

export interface PasswordObject { [key: string]: IPassword; }

export interface IImportedPasswordResponse {
  created: PasswordObject;
  updated: PasswordObject;
}
