import { IReturnService, ValidationError, CustomError, NotFoundError, ConflictError } from '../../utils';
import { AuthService } from '../auth/auth_service';
import { IAdminInput } from './admin_interface';
import Admin, { AdminDocument } from './admin_model';

interface IAdminService {
	auth: AuthService;
	postAdmin(body: IAdminInput): Promise<IReturnService>;
	getAllAdmins(): Promise<IReturnService>;
	getOneAdmin(id: string): Promise<IReturnService>;
	patchAdmin(id: string, body: AdminDocument): Promise<IReturnService>;
	patchPassword(id: string, oldPassword: string, newPassword: string): Promise<IReturnService>;
	deleteAdmin(id: string): Promise<IReturnService>;
	postLoginAdmin(username: string, password: string): Promise<IReturnService>;
	postResetPasswordWithTempPassword(username: string): Promise<IReturnService>;
}

const NAMESPACE = 'Admin';
export class AdminService implements IAdminService {
	auth = new AuthService();

	/**
	 * Create new admin and return it
	 * @param props
	 * @returns AdminDocument
	 */
	async postAdmin(props: any) {
		let body = props as IAdminInput;
		body.username = body.username.split(' ').join('_').toLowerCase();

		try {
			// Check if username is already registered
			const isUserExists = await Admin.findOne({ username: body.username }).exec();
			if (isUserExists) throw new ConflictError(NAMESPACE, 'Admin with this username  already exists');

			// Hash password
			const hashedPassword = await this.auth.hashPW(body.password);

			// Create new admin and remove password from response
			const createdAdmin = await Admin.create({ ...body, password: hashedPassword });
			const { password, ...result } = createdAdmin.toJSON();

			return { statusCode: 200, message: 'Admin Created', result };
		} catch (err: any) {
			// Throw ValidationError if validation (based on model) fails
			if (err.name === 'ValidationError') throw new ValidationError(err.errors);
			// Throw ConflictError if username is already registered
			if (err.name === 'MongoServerError' && err.code === 11000) {
				throw new ConflictError(err.name, 'Admin with this username already exists');
			}
			throw new CustomError('Something went wrong');
		}
	}

	/**
	 * Get all admins and return it
	 * @returns AdminDocument[]
	 */
	async getAllAdmins() {
		const allAdmins = await Admin.find().sort('-updatedAt').exec();

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
	async patchAdmin(id: string, body: AdminDocument) {
		try {
			const { password, ...bodyWithoutPW } = body;

			const updatedAdmin = await Admin.findByIdAndUpdate(id, bodyWithoutPW, { new: true }).exec();
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
	async patchPassword(id: string, oldPassword: string, newPassword: string) {
		const singleAdmin = await Admin.findById(id).exec();
		if (!singleAdmin) throw new NotFoundError(NAMESPACE);

		// Throw ValidationError if oldPassword and/or newPassword is not provided
		if (!oldPassword || !newPassword) {
			let errors: any = {};
			if (!oldPassword) errors.oldPassword = 'Old Password is required';
			if (!newPassword) errors.newPassword = 'New Password is required';
			throw new CustomError('Validation Error', { statusCode: 401, errors });
		}

		// Throw CustomError if old password is incorrect
		if (!(await this.auth.comparePW(oldPassword, singleAdmin.password))) {
			throw new CustomError('Something went wrong', {
				statusCode: 401,
				errors: { oldPassword: 'Old Password is incorrect' }
			});
		}

		// Throw CustomError if new password is the same as old password
		if (await this.auth.comparePW(newPassword, singleAdmin.password)) {
			throw new CustomError('Something went wrong', {
				statusCode: 401,
				errors: {
					newPassword: 'The new password you entered is the same as the old password. Enter a different one.'
				}
			});
		}

		// Hash password
		const hashedPassword = await this.auth.hashPW(newPassword);

		const updatedAdmin = await Admin.findByIdAndUpdate(id, { password: hashedPassword }, { new: true }).exec();

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

	/**
	 * Login admin with username and password
	 * @param username
	 * @param password
	 * @returns AdminDocument with generated token
	 */
	async postLoginAdmin(username: string, password: string) {
		// Throw CustomError if username or password is not available
		if (!username || !password) throw new CustomError('Username and Password are required');

		// Find admin by username
		const singleAdmin = await Admin.findOne({ username }).exec();
		if (!singleAdmin) throw new NotFoundError(NAMESPACE);

		// Throw CustomError if password is incorrect
		if (!(await this.auth.comparePW(password, singleAdmin.password))) {
			throw new CustomError('Something went wrong', {
				statusCode: 400,
				errors: { password: 'Password is incorrect' }
			});
		}

		// Generate token with jwt
		const token = this.auth.generateToken(singleAdmin._id);

		return {
			statusCode: 200,
			message: 'Admin Logged In',
			result: singleAdmin,
			token
		};
	}

	/**
	 * Reset admin's password by username
	 * @param username
	 * @returns randomly generated temporary password
	 */
	async postResetPasswordWithTempPassword(username: string) {
		const isUserExists = await Admin.findOne({ username }).exec();
		if (!isUserExists) throw new NotFoundError(NAMESPACE);

		// Create a new temp password
		const temporaryPW: string = Math.random().toString(36).slice(4, 12);

		// Hash password
		const hashedPassword = await this.auth.hashPW(temporaryPW);

		// Update admin's password
		await Admin.updateOne({ username }, { password: hashedPassword }, { new: true }).exec();
		return {
			statusCode: 200,
			message: 'Password Admin has been reset',
			result: temporaryPW
		};
	}
}
