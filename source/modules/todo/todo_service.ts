import { TReturnService } from '../../utils';

interface ITodoInput {
	title: string;
}

interface ITodoService {
	postTodo(body: ITodoInput): Promise<TReturnService>;
	getAllTodos(): Promise<TReturnService>;
	getOneTodo(id: string): Promise<TReturnService>;
	putTodo(id: string): Promise<TReturnService>;
	deleteTodo(id: string): Promise<TReturnService>;
}

export class TodoService implements ITodoService {
	/**
	 * Create new todo and return it
	 * @returns any | unknown
	 */
	async postTodo(props: any) {
		try {
			let body = { ...props } as ITodoInput;

			if (!body.title) {
				return {
					code: 400,
					message: 'Create Todo failed',
					result: 'Title is required'
				};
			}

			return {
				code: 200,
				message: 'Todo Created',
				result: dummySingleJson
			};
		} catch (error) {
			throw new Error(`${error}`);
		}
	}

	/**
	 * Get all todos and return it
	 * @returns any | unknown
	 */
	async getAllTodos() {
		try {
			return {
				code: 200,
				message: 'Get All Todos',
				result: dummyArrayJson
			};
		} catch (error) {
			throw new Error(`${error}`);
		}
	}

	/**
	 * Get a todo by ID and return it
	 * @param id selected todo id
	 * @returns any | unknown
	 */
	async getOneTodo(id: string) {
		try {
			return {
				code: 200,
				message: 'Get Todo',
				result: { ...dummySingleJson, title: `Todo ${id}` }
			};
		} catch (error) {
			throw new Error(`${error}`);
		}
	}

	/**
	 * Update a todo by ID and return it
	 * @param id selected todo id
	 * @returns any | unknown
	 */
	async putTodo(id: string) {
		try {
			return {
				code: 200,
				message: 'Todo Updated',
				result: { ...dummySingleJson, title: `Todo ${id}` }
			};
		} catch (error) {
			throw new Error(`${error}`);
		}
	}

	/**
	 * Delete a todo by ID and return it
	 * @param id selected todo id
	 * @returns any | unknown
	 */
	async deleteTodo(id: string) {
		try {
			return {
				code: 200,
				message: 'Todo Deleted',
				result: { ...dummySingleJson, title: `Todo ${id}` }
			};
		} catch (error) {
			throw new Error(`${error}`);
		}
	}
}

const dummySingleJson = {
	title: 'Todo 2',
	isDone: false,
	createdAt: '2022-02-25T19:15:20.000Z',
	updatedAt: '2022-02-25T19:15:20.000Z'
};

const dummyArrayJson = [
	{
		title: 'Todo 1',
		isDone: true,
		createdAt: '2022-02-25T19:15:20.000Z',
		updatedAt: '2022-02-25T19:15:20.000Z'
	},
	{
		title: 'Todo 2',
		isDone: false,
		createdAt: '2022-02-25T19:15:20.000Z',
		updatedAt: '2022-02-25T19:15:20.000Z'
	}
];
