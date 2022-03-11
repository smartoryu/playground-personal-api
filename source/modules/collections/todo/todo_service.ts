import { CustomError, IReturnService, NotFoundError, ValidationError } from '../../../utils';
import { ITodoInput } from './todo_interface';
import Todo, { TodoDocument } from './todo_model';

interface ITodoService {
	postTodo(adminId: string, body: ITodoInput): Promise<IReturnService>;
	getAllTodos(): Promise<IReturnService>;
	getOneTodo(id: string): Promise<IReturnService>;
	putTodo(id: string, adminId: string, body: TodoDocument): Promise<IReturnService>;
	deleteTodo(id: string): Promise<IReturnService>;
}

const NAMESPACE = 'Todo';
export class TodoService implements ITodoService {
	/**
	 * Create new todo and return it
	 * @returns TodoDocument
	 */
	async postTodo(adminId: string, body: ITodoInput) {
		try {
			const createdTodo = await Todo.create({
				title: body.title,
				createdBy: adminId
			});

			return {
				statusCode: 200,
				message: 'Todo Created',
				result: createdTodo
			};
		} catch (err: any) {
			// Throw ValidationError if validation (based on model) fails
			if (err.name === 'ValidationError') throw new ValidationError(err.errors);
			throw new CustomError('Something went wrong');
		}
	}

	/**
	 * Get all todos and return it
	 * @returns TodoDocument[]
	 */
	async getAllTodos() {
		const allTodos = await Todo.find().populate(['createdBy', 'lastEditBy']).sort('-createdAt').exec();

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
		const singleTodo = await Todo.findById(id).populate(['createdBy', 'lastEditBy']).exec();
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
	async putTodo(id: string, adminId: string, body: TodoDocument) {
		const updatedTodo = await Todo.findByIdAndUpdate(id, { ...body, lastEditBy: adminId }, { new: true }).exec();
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
