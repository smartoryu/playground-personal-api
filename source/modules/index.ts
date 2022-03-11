import { Router } from 'express';
import { IController } from '../utils';
import { AdminController } from './collections/admin/admin_controller';
import { TodoController } from './collections/todo/todo_controller';

interface IApiModules {
	path: String;
	router: Router;
	controllers: IController[];
}

export default class API_MODULES implements IApiModules {
	path = '/';
	router = Router();
	controllers = [
		new TodoController(),
		new AdminController()
		//
	];

	constructor() {
		this.initController();
	}

	private initController = () => {
		this.controllers.forEach((controller) => {
			this.router.use(this.path, controller.router);
		});
	};
}
