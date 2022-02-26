import express, { Application, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import config from './configs';
import { logging } from './utils';
import API_MODULES from './modules';

dotenv.config({ path: path.join(__dirname, '../.env') });

const app: Application = express();
const NAMESPACE = 'SERVER';

/** Log the request & response */
app.use((req, res, next) => {
	/** Log the request */
	logging.info(NAMESPACE + '-REQUEST', {
		method: req.method,
		url: req.url,
		ip: req.socket.remoteAddress
	});

	res.on('finish', () => {
		/** Log the response */
		logging.info(NAMESPACE + '-RESPONSE', {
			method: req.method,
			url: req.url,
			status: res.statusCode,
			ip: req.socket.remoteAddress
		});
	});

	next();
});

/** Parse the body of the request */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/** Initiate routes */
const apiModules = new API_MODULES();
app.use('/api', apiModules.router);

/** Error handling */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	/** internal logging */
	logging.error(NAMESPACE, { message: err.message, stack: err.stack });
	
	/** adding stack on development enviroment */
	let json: any = { message: 'Something went wrong', error: err.message };
	if (process.env.NODE_ENV === 'development') json.stack = err.stack;
	res.status(400).json(json);
});

/** Create server */
const httpServer = http.createServer(app);

/** Listen server */
httpServer.listen(config.server.port, () => {
	logging.info(NAMESPACE, { message: `Server is running on ${config.server.hostname}:${config.server.port}` });
});

/** Set server timeout */
httpServer.setTimeout(10000);
