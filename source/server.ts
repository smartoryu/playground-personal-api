import express, { Application } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import config from './configs';
import { logging } from './utils';
import API_MODULES from './modules';

dotenv.config({ path: path.join(__dirname, '.env') });

const app: Application = express();
const NAMESPACE = 'SERVER';

/** Log the request & response */
app.use((req, res, next) => {
	/** Log the req */
	logging.info(NAMESPACE, {
		method: req.method,
		url: req.url,
		ip: req.socket.remoteAddress
	});

	res.on('finish', () => {
		/** Log the res */
		logging.info(NAMESPACE, {
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
app.use((req, res, next) => {
	res.status(404).json({
		message: 'Not Found'
	});
});

/** Create server */
const httpServer = http.createServer(app);

/** Listen server */
httpServer.listen(config.server.port, () => {
	logging.info(NAMESPACE, { message: `Server is running on ${config.server.hostname}:${config.server.port}` });
});

/** Set server timeout */
httpServer.setTimeout(10000);
