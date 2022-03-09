import { IReturnService, ValidationError, CustomError, NotFoundError, ConflictError } from '../../utils';
import { IAdminInput } from './admin_interface';
import Admin, { AdminDocument } from './admin_model';

interface IAdminService {
	postAdmin(body: IAdminInput): Promise<IReturnService>;
	getAllAdmins(): Promise<IReturnService>;
	getOneAdmin(id: string): Promise<IReturnService>;
	putAdmin(id: string, body: AdminDocument): Promise<IReturnService>;
	deleteAdmin(id: string): Promise<IReturnService>;
}

const NAMESPACE = 'Admin';
export class AdminService implements IAdminService {
	/**
	 * Create new admin and return it
	 * @param props
	 * @returns AdminDocument
	 */
	async postAdmin(props: any) {
		let body = props as IAdminInput;

		try {
			const createdAdmin = await Admin.create(body);
			return { statusCode: 200, message: 'Admin Created', result: createdAdmin };
		} catch (err: any) {
			// Throw ValidationError if validation (based on model) fails
			if (err.name === 'ValidationError') throw new ValidationError(err.errors);
			// Throw ConflictError if username is already registered
			if (err.name === 'MongoServerError' && err.code === 11000) {
				throw new ConflictError(err.name, 'Duplicate Username');
			}
			throw new CustomError('Something went wrong');
		}
	}

	/**
	 * Get all admins and return it
	 * @returns AdminDocument[]
	 */
	async getAllAdmins() {
		const allAdmins = await Admin.find().sort('-createdAt').exec();

		return {
			statusCode: 200,
			message: 'Get All Admins',
			result: allAdmins
		};
	}

	/**
	 * Get a admin by ID and return it
	 * @param id selected admin id
	 * @returns AdminDocument
	 */
	async getOneAdmin(id: string) {
		const singleAdmin = await Admin.findById(id).exec();
		if (!singleAdmin) throw new NotFoundError(NAMESPACE);

		return {
			statusCode: 200,
			message: 'Get Single Admin',
			result: singleAdmin
		};
	}

	/**
	 * Update an admin by ID and return it
	 * @param id selected admin id
	 * @param body selected admin data
	 * @returns AdminDocument
	 */
	async putAdmin(id: string, body: AdminDocument) {
		try {
			const updatedAdmin = await Admin.findByIdAndUpdate(id, body, { new: true }).exec();
			if (!updatedAdmin) throw new NotFoundError(NAMESPACE);
			return {
				statusCode: 200,
				message: 'Admin Updated',
				result: updatedAdmin
			};
		} catch (err: any) {
			// Throw ValidationError if validation (based on model) fails
			if (err.name === 'ValidationError') throw new ValidationError(err.errors);
			// Throw ConflictError if username is already registered
			if (err.name === 'MongoServerError' && err.code === 11000) {
				throw new ConflictError(err.name, 'Duplicate Username');
			}
			throw new CustomError('Something went wrong');
		}
	}

	/**
	 * Update admin's password by ID, provided with old password, and return it
	 * @param id selected admin id
	 * @param oldPassword provided old password
	 * @param newPassword provided new password
	 * @returns AdminDocument
	 */
	async putPassword(id: string, oldPassword: string, newPassword: string) {
		const singleAdmin = await Admin.findById(id).exec();
		if (!singleAdmin) throw new NotFoundError(NAMESPACE);

		// Throw ValidationError if old and/or new password is not provided
		if (!oldPassword || !newPassword) {
			let errors: any = {};
			if (!oldPassword) errors.oldPassword = 'Old Password is required';
			if (!newPassword) errors.newPassword = 'New Password is required';
			throw new CustomError('Validation Error', { statusCode: 401, errors });
		}

		// Throw CustomError if old password is not correct
		if (oldPassword !== singleAdmin.password) {
			throw new CustomError('Something went wrong', {
				statusCode: 401,
				errors: { oldPassword: 'Old Password is incorrect' }
			});
		}

		// Throw CustomError if new password is the same as old password
		if (oldPassword === newPassword) {
			throw new CustomError('Something went wrong', {
				statusCode: 401,
				errors: {
					newPassword: 'The new password you entered is the same as the old password. Enter a different password.'
				}
			});
		}

		const updatedAdmin = await Admin.findByIdAndUpdate(id, { password: newPassword }, { new: true }).exec();

		return {
			statusCode: 200,
			message: 'Admin Updated',
			result: updatedAdmin
		};
	}

	/**
	 * Delete an admin by ID and return it
	 * @param id selected admin id
	 * @returns AdminDocument
	 */
	async deleteAdmin(id: string) {
		const deletedAdmin = await Admin.findByIdAndDelete(id).exec();
		if (!deletedAdmin) throw new NotFoundError(NAMESPACE);

		return {
			statusCode: 200,
			message: 'Admin Deleted',
			result: deletedAdmin
		};
	}
}
