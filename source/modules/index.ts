import { Router } from 'express';
import { IController } from '../utils';
import { TodoController } from './todo/todo_controller';

interface IApiModules {
	path: String;
	router: Router;
	controllers: IController[];
}

export default class API_MODULES implements IApiModules {
	path = '/';
	router = Router();
	controllers = [
		new TodoController()
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
