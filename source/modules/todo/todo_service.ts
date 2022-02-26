import { resConflict, resNotFound, TReturnService } from '../../utils';
import { ITodoInput } from './todo_interface';
import Todo, { TodoDocument } from './todo_model';

interface ITodoService {
	postTodo(body: ITodoInput): Promise<TReturnService>;
	getAllTodos(): Promise<TReturnService>;
	getOneTodo(id: string): Promise<TReturnService>;
	putTodo(id: string, body: TodoDocument): Promise<TReturnService>;
	deleteTodo(id: string): Promise<TReturnService>;
}

const NAMESPACE = 'Todo';
export class TodoService implements ITodoService {
	/**
	 * Create new todo and return it
	 * @returns TodoDocument
	 */
	async postTodo(props: any) {
		let body = props as ITodoInput;
		if (!body.title) return resConflict('Title is required');

		const createdTodo = await Todo.create({ title: body.title });

		return {
			code: 200,
			message: 'Todo Created',
			result: createdTodo
		};
	}

	/**
	 * Get all todos and return it
	 * @returns TodoDocument[]
	 */
	async getAllTodos() {
		try {
			const allTodos = await Todo.find().sort('-createdAt').exec();

			return {
				code: 200,
				message: 'Get All Todos',
				result: allTodos
			};
		} catch (error) {
			throw new Error(`${error}`);
		}
	}

	/**
	 * Get a todo by ID and return it
	 * @param id selected todo id
	 * @returns TodoDocument
	 */
	async getOneTodo(id: string) {
		try {
			const singleTodo = await Todo.findById(id).exec();
			if (!singleTodo) return resNotFound(NAMESPACE);

			return {
				code: 200,
				message: 'Get Single Todo',
				result: singleTodo
			};
		} catch (error) {
			throw new Error(`${error}`);
		}
	}

	/**
	 * Update a todo by ID and return it
	 * @param id selected todo id
	 * @param body update object
	 * @returns TodoDocument
	 */
	async putTodo(id: string, body: TodoDocument) {
		try {
			const singleTodo = await Todo.findById(id);
			if (!singleTodo) return resNotFound(NAMESPACE);

			const updatedTodo = await Todo.findByIdAndUpdate(id, body, { new: true }).exec();

			return {
				code: 200,
				message: 'Todo Updated',
				result: updatedTodo
			};
		} catch (error) {
			throw new Error(`${error}`);
		}
	}

	/**
	 * Delete a todo by ID and return it
	 * @param id selected todo ids
	 * @returns TodoDocument
	 */
	async deleteTodo(id: string) {
		try {
			const singleTodo = await Todo.findById(id);
			if (!singleTodo) return resNotFound(NAMESPACE);

			const deletedTodo = await Todo.findByIdAndDelete(id).exec();

			return {
				code: 200,
				message: 'Todo Deleted',
				result: deletedTodo
			};
		} catch (error) {
			throw new Error(`${error}`);
		}
	}
}
