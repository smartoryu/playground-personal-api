import { IReturnService, NotFoundError } from '../../utils';
import { ITodoInput } from './todo_interface';
import Todo, { TodoDocument } from './todo_model';

interface ITodoService {
	postTodo(body: ITodoInput): Promise<IReturnService>;
	getAllTodos(): Promise<IReturnService>;
	getOneTodo(id: string): Promise<IReturnService>;
	putTodo(id: string, body: TodoDocument): Promise<IReturnService>;
	deleteTodo(id: string): Promise<IReturnService>;
}

const NAMESPACE = 'Todo';
export class TodoService implements ITodoService {
	/**
	 * Create new todo and return it
	 * @returns TodoDocument
	 */
	async postTodo(body: ITodoInput) {
		const createdTodo = await Todo.create({ title: body.title });

		return {
			statusCode: 200,
			message: 'Todo Created',
			result: createdTodo
		};
	}

	/**
	 * Get all todos and return it
	 * @returns TodoDocument[]
	 */
	async getAllTodos() {
		const allTodos = await Todo.find().sort('-createdAt').exec();

		return {
			statusCode: 200,
			message: 'Get All Todos',
			result: allTodos
		};
	}

	/**
	 * Get a todo by ID and return it
	 * @param id selected todo id
	 * @returns TodoDocument
	 */
	async getOneTodo(id: string) {
		const singleTodo = await Todo.findById(id).exec();
		if (!singleTodo) throw new NotFoundError(NAMESPACE);

		return {
			statusCode: 200,
			message: 'Get Single Todo',
			result: singleTodo
		};
	}

	/**
	 * Update a todo by ID and return it
	 * @param id selected todo id
	 * @param body update object
	 * @returns TodoDocument
	 */
	async putTodo(id: string, body: TodoDocument) {
		const updatedTodo = await Todo.findByIdAndUpdate(id, body, { new: true }).exec();
		if (!updatedTodo) throw new NotFoundError(NAMESPACE);

		return {
			statusCode: 200,
			message: 'Todo Updated',
			result: updatedTodo
		};
	}

	/**
	 * Delete a todo by ID and return it
	 * @param id selected todo ids
	 * @returns TodoDocument
	 */
	async deleteTodo(id: string) {
		const deletedTodo = await Todo.findByIdAndDelete(id).exec();
		if (!deletedTodo) throw new NotFoundError(NAMESPACE);

		return {
			statusCode: 200,
			message: 'Todo Deleted',
			result: deletedTodo
		};
	}
}
