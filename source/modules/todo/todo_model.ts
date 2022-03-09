import { Document, Model, model, Schema, Types } from 'mongoose';
import { IAdmin } from '../admin/admin_interface';
import { ITodo } from './todo_interface';

const TodoSchema: Schema = new Schema<ITodo>(
	{
		title: { type: String, required: [true, 'Title is required'] },
		createdBy: { type: Types.ObjectId, required: [true, 'CreatedBy is required'], ref: 'Admin' },
		lastEditBy: { type: Types.ObjectId, ref: 'Admin', default: null },
		isDone: { type: Boolean, default: false }
	},
	{ timestamps: true }
);

export interface TodoDocument extends ITodo, Document {
	createdBy: IAdmin['_id'];
	lastEditBy: IAdmin['_id'];
}

export interface TodoModel extends Model<TodoDocument> {}

export default model<TodoDocument, TodoModel>('Todo', TodoSchema);
