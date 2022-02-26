import { Document, Model, model, Schema } from 'mongoose';
import { ITodo } from './todo_interface';

const TodoSchema: Schema = new Schema<ITodo>(
	{
		title: { type: String, required: [true, 'Title is required'] },
		isDone: { type: Boolean, default: false }
	},
	{ timestamps: true }
);

export interface TodoDocument extends ITodo, Document {}

export interface TodoModel extends Model<TodoDocument> {}

export default model<TodoDocument, TodoModel>('Todo', TodoSchema);
