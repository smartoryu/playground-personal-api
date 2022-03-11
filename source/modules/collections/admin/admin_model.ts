import { Document, Model, model, Schema } from 'mongoose';
import { IAdmin } from './admin_interface';

const AdminSchema: Schema = new Schema<IAdmin>(
	{
		fullname: { type: String, required: [true, 'Fullname is required'] },
		username: { type: String, required: [true, 'Username is required'], unique: true },
		password: { type: String, required: [true, 'Password is required'], minlength: [8, 'Password must be at least 8 characters'] },
		photo: { type: String },
		code: { type: String },
		role: { type: String, required: [true, 'Role is required'], enum: ['super', 'guest'] }
	},
	{ timestamps: true }
);

export interface AdminDocument extends IAdmin, Document {}

export interface AdminModel extends Model<AdminDocument> {}

export default model<AdminDocument, AdminModel>('Admin', AdminSchema);
