import { Router, Request, Response } from 'express';
import { IController, logging } from '../../utils';
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

	private createTodo = (req: Request, res: Response) => {
		this.service
			.postTodo(req.body)
			.then(({ code, message, result }) => {
				res.status(code).json({ message, result });
			})
			.catch((error) => {
				res.status(500).json({
					message: 'Internal Server Error',
					error
				});
			});
	};

	private getTodos = (req: Request, res: Response) => {
		this.service
			.getAllTodos()
			.then(({ code, message, result }) => {
				res.status(code).json({ message, result });
			})
			.catch((error: Error) => {
				res.status(500).json({
					message: 'Internal Server Error',
					error
				});
			});
	};

	private getTodoById = (req: Request, res: Response) => {
		this.service
			.getOneTodo(req.params.id)
			.then(({ code, message, result }) => {
				res.status(code).json({ message, result });
			})
			.catch((error: Error) => {
				res.status(500).json({
					message: 'Internal Server Error',
					error
				});
			});
	};

	private updateTodoById = (req: Request, res: Response) => {
		this.service
			.putTodo(req.params.id)
			.then(({ code, message, result }) => {
				res.status(code).json({ message, result });
			})
			.catch((error: Error) => {
				res.status(500).json({
					message: 'Internal Server Error',
					error
				});
			});
	};

	private deleteTodoById = (req: Request, res: Response) => {
		this.service
			.deleteTodo(req.params.id)
			.then(({ code, message, result }) => {
				res.status(code).json({ message, result });
			})
			.catch((error: Error) => {
				res.status(500).json({
					message: 'Internal Server Error',
					error
				});
			});
	};
}
