import asyncHandler from 'express-async-handler';
import { Router, Request, Response } from 'express';
import { IController } from '../../../utils';
import { TodoService } from './todo_service';
import { AuthMiddleware } from '../../auth/auth_middleware';

export class TodoController implements IController {
	path = '/todos';
	router = Router();
	service: TodoService;
	auth: AuthMiddleware;

	constructor() {
		this.auth = new AuthMiddleware();

		this.initRouter();
		this.service = new TodoService();
	}

	private initRouter() {
		const PROTECT = this.auth.protect;

		this.router.route(this.path).post(PROTECT, this.createTodo).get(PROTECT, this.getTodos);
		this.router
			.route(this.path + '/:id')
			.get(PROTECT, this.getTodoById)
			.put(PROTECT, this.updateTodoById)
			.delete(PROTECT, this.deleteTodoById);
	}

	private createTodo = asyncHandler(async (req: Request, res: Response) => {
		const { statusCode, ...result } = await this.service.postTodo(req.decoded, req.body);
		res.status(statusCode).json(result);
	});

	private getTodos = asyncHandler(async (req: Request, res: Response) => {
		const { statusCode, ...result } = await this.service.getAllTodos();
		res.status(statusCode).json(result);
	});

	private getTodoById = asyncHandler(async (req: Request, res: Response) => {
		const { statusCode, ...result } = await this.service.getOneTodo(req.params.id);
		res.status(statusCode).json(result);
	});

	private updateTodoById = asyncHandler(async (req: Request, res: Response) => {
		const { statusCode, ...result } = await this.service.putTodo(req.params.id, req.decoded, req.body);
		res.status(statusCode).json(result);
	});

	private deleteTodoById = asyncHandler(async (req: Request, res: Response) => {
		const { statusCode, ...result } = await this.service.deleteTodo(req.params.id);
		res.status(statusCode).json(result);
	});
}
