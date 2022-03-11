import { Router } from 'express';
import cron from 'node-cron';
import { IController, ICronJob } from '../utils';
import { AdminController } from './collections/admin/admin_controller';
import { TodoController } from './collections/todo/todo_controller';
import { cronDeleteGuestAdmin } from './jobs';

interface IApiModules {
	path: String;
	router: Router;
	controllers: IController[];
	crons: ICronJob[];
}

export default class API_MODULES implements IApiModules {
	path = '/';
	router = Router();
	controllers = [
		new TodoController(),
		new AdminController()
		//
	];
	crons = [cronDeleteGuestAdmin];

	constructor() {
		this.initController();
		this.initCrons();
	}

	private initController = () => {
		this.controllers.forEach((controller) => {
			this.router.use(this.path, controller.router);
		});
	};

	private initCrons = () => {
		this.crons.forEach(({ time, action }) => {
			cron.schedule(time, action, { timezone: 'Asia/Jakarta' });
		});
	};
}
