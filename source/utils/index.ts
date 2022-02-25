import { Router } from 'express';

export { default as logging } from './logging';

export interface IController {
	path: String;
	router: Router;
}

export type TReturnService = {
	code: number;
	result?: any;
	message: string;
};
