import asyncHandler from 'express-async-handler';
import { Router, Request, Response } from 'express';
import { IController } from '../../utils';
import { AdminService } from './admin_service';

export class AdminController implements IController {
	path = '/admins';
	router = Router();
	service: AdminService;

	constructor() {
		this.initRouter();
		this.service = new AdminService();
	}

	private initRouter() {
		this.router.route(this.path).post(this.createAdmin).get(this.getAdmins);
		this.router
			.route(this.path + '/:id')
			.get(this.getAdminById)
			.put(this.updateAdminById)
			.delete(this.deleteAdminById);
		this.router.route(this.path + '/:id/password').put(this.updatePassword);
	}

	private createAdmin = asyncHandler(async (req: Request, res: Response) => {
		const { statusCode, message, result } = await this.service.postAdmin(req.body);
		res.status(statusCode).json({ message, result });
	});

	private getAdmins = asyncHandler(async (req: Request, res: Response) => {
		const { statusCode, message, result } = await this.service.getAllAdmins();
		res.status(statusCode).json({ message, result });
	});

	private getAdminById = asyncHandler(async (req: Request, res: Response) => {
		const { statusCode, message, result } = await this.service.getOneAdmin(req.params.id);
		res.status(statusCode).json({ message, result });
	});

	private updateAdminById = asyncHandler(async (req: Request, res: Response) => {
		const { statusCode, message, result } = await this.service.putAdmin(req.params.id, req.body);
		res.status(statusCode).json({ message, result });
	});

	private deleteAdminById = asyncHandler(async (req: Request, res: Response) => {
		const { statusCode, message, result } = await this.service.deleteAdmin(req.params.id);
		res.status(statusCode).json({ message, result });
	});

	private updatePassword = asyncHandler(async (req: Request, res: Response) => {
		let id = req.params.id;
		let oldP = req.body.oldPassword;
		let newP = req.body.newPassword;
		const { statusCode, message, result } = await this.service.putPassword(id, oldP, newP);
		res.status(statusCode).json({ message, result });
	});
}
