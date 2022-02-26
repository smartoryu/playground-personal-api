import { Document } from 'mongoose';

export interface ITodo extends Document {
	title: string;
	isDone: boolean;
}

export interface ITodoInput extends Document {
	title: string;
}
