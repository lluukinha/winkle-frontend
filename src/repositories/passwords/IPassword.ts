import { IFolder } from "../folder/IFolder";

export interface IPassword {
  description: string;
  id?: string;
  login: string;
  name: string;
  password: string;
  type: string;
  url: string;
  folder: IFolder
}