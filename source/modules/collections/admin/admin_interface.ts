import { Document } from 'mongoose';

export interface IAdmin extends Document {
	username: string;
	fullname: string;
	password: string;
	photo: string;
	code: string;
	role: string;
}

export interface IAdminInput extends Document {
  username: string;
  fullname: string;
  password: string;
  newPassword?: string;
  photo: string;
}

export interface IAdminLogin extends Document {
	username: string;
	password: string;
}
