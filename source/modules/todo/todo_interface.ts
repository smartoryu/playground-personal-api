import { Document } from 'mongoose';
import { IAdmin } from '../admin/admin_interface';

export interface ITodo extends Document {
	title: string;
	createdBy: IAdmin | string;
	lastEditBy: IAdmin | string | null;
	isDone: boolean;
}

export interface ITodoInput extends Document {
	title: string;
	createdBy: string;
	lastEditBy?: string;
	isDone?: boolean;
}
