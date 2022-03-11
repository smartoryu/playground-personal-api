import asyncHandler from 'express-async-handler';
import { Router, Request, Response } from 'express';
import { IController } from '../../../utils';
import { AdminService } from './admin_service';
import { AuthMiddleware } from '../../auth/auth_middleware';

interface IQueryAdmin {
	username: string;
}
export class AdminController implements IController {
	path = '/admins';
	router = Router();
	service: AdminService;
	auth: AuthMiddleware;

	constructor() {
		this.auth = new AuthMiddleware();

		this.initRouter();
		this.service = new AdminService();
	}

	private initRouter() {
		const PROTECT = this.auth.protect;

		this.router.route(this.path).post(this.createAdmin).get(PROTECT, this.getAdmins);
		this.router
			.route(this.path + '/:id')
			.get(PROTECT, this.getAdminById)
			.patch(PROTECT, this.updateAdminById)
			.delete(PROTECT, this.deleteAdminById);
		this.router.route(this.path + '/:id/change-password').patch(PROTECT, this.updatePassword);
		this.router.route(this.path + '/reset-password').post(this.resetPassword);
		this.router.route(this.path + '/login').post(this.loginAdmin);
	}

	private createAdmin = asyncHandler(async (req: Request, res: Response) => {
		const { statusCode, ...result } = await this.service.postAdmin(req.body);
		res.status(statusCode).json(result);
	});

	private getAdmins = asyncHandler(async (req: Request, res: Response) => {
		const { statusCode, ...result } = await this.service.getAllAdmins();
		res.status(statusCode).json(result);
	});

	private getAdminById = asyncHandler(async (req: Request, res: Response) => {
		const { statusCode, ...result } = await this.service.getOneAdmin(req.params.id);
		res.status(statusCode).json(result);
	});

	private updateAdminById = asyncHandler(async (req: Request, res: Response) => {
		const { statusCode, ...result } = await this.service.patchAdmin(req.params.id, req.body);
		res.status(statusCode).json(result);
	});

	private deleteAdminById = asyncHandler(async (req: Request, res: Response) => {
		const { statusCode, ...result } = await this.service.deleteAdmin(req.params.id);
		res.status(statusCode).json(result);
	});

	private updatePassword = asyncHandler(async (req: Request, res: Response) => {
		let id = req.params.id;
		let oldP = req.body.oldPassword;
		let newP = req.body.newPassword;
		const { statusCode, ...result } = await this.service.patchPassword(id, oldP, newP);
		res.status(statusCode).json(result);
	});

	private loginAdmin = asyncHandler(async (req: Request, res: Response) => {
		const { statusCode, ...result } = await this.service.postLoginAdmin(req.body.username, req.body.password);
		res.status(statusCode).json(result);
	});

	private resetPassword = asyncHandler(async (req: Request<{}, {}, {}, IQueryAdmin>, res: Response) => {
		// TODO LIMIT ACCESS TO THIS METHOD
		const { statusCode, ...result } = await this.service.postResetPasswordWithTempPassword(req.query.username);
		res.status(statusCode).json(result);
	});
}
