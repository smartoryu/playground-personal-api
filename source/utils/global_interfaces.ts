import { Router } from 'express';

export interface IController {
	path: String;
	router: Router;
}

export interface IReturnService {
	statusCode: number;
	result?: any;
	error?: any;
	message: string;
}
