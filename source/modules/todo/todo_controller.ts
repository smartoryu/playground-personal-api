import asyncHandler from 'express-async-handler';
import { Router, Request, Response } from 'express';
import { IController } from '../../utils';
import { TodoService } from './todo_service';

export class TodoController implements IController {
	path = '/todos';
	router = Router();
	service: TodoService;

	constructor() {
		this.initRouter();
		this.service = new TodoService();
	}

	private initRouter() {
		this.router.route(this.path).post(this.createTodo).get(this.getTodos);
		this.router
			.route(this.path + '/:id')
			.get(this.getTodoById)
			.put(this.updateTodoById)
			.delete(this.deleteTodoById);
	}

	private createTodo = asyncHandler(async (req: Request, res: Response) => {
		const { statusCode, message, result } = await this.service.postTodo(req.body);
		res.status(statusCode).json({ message, result });
	});

	private getTodos = asyncHandler(async (req: Request, res: Response) => {
		const { statusCode, message, result } = await this.service.getAllTodos();
		res.status(statusCode).json({ message, result });
	});

	private getTodoById = asyncHandler(async (req: Request, res: Response) => {
		const { statusCode, message, result } = await this.service.getOneTodo(req.params.id);
		res.status(statusCode).json({ message, result });
	});

	private updateTodoById = asyncHandler(async (req: Request, res: Response) => {
		const { statusCode, message, result } = await this.service.putTodo(req.params.id, req.body);
		res.status(statusCode).json({ message, result });
	});

	private deleteTodoById = asyncHandler(async (req: Request, res: Response) => {
		const { statusCode, message, result } = await this.service.deleteTodo(req.params.id);
		res.status(statusCode).json({ message, result });
	});
}
