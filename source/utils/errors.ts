interface ICustomError {
	statusCode?: number;
	message?: string;
	error?: any;
	errors?: any;
}

export class CustomError extends Error {
	error?: any;
	errors?: any;
	statusCode: number;

	constructor({ statusCode, message, error, errors }: ICustomError) {
		super(message || 'Something went wrong');

		this.name = this.constructor.name;
		this.errors = errors;
		this.error = error;
		this.statusCode = statusCode || 500;
	}
}

export class ValidationError extends CustomError {
	constructor(errors?: any) {
		super({ statusCode: 403, message: 'Validation Error' });

		this.getErrors(errors);
	}

	private getErrors(v?: any) {
		let obj: any = {};
		for (let k in v) obj[k] = v[k].message;
		this.errors = obj;
	}
}

export class NotFoundError extends CustomError {
	constructor(namespace: string, error?: string) {
		super({ statusCode: 404, message: `${namespace} Not Found`, error });
	}
}

export class ConflictError extends CustomError {
	constructor(message?: string, error?: string) {
		super({ statusCode: 409, message: message || 'Conflict', error });
	}
}
