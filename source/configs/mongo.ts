const MONGO_OPTIONS = {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	socketTimeoutMS: 30000,
	keepAlive: true,
	poolSize: 50,
	autoIndex: false,
	retryWrites: false
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || 'prikenang';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '@BahagiaMongo';
const MONGO_HOST = process.env.MONGO_HOST || ``;
const MONGO_DATABASE = process.env.MONGO_DATABASE || '';

export const MONGO = {
	host: MONGO_HOST,
	password: MONGO_PASSWORD,
	username: MONGO_USERNAME,
	options: MONGO_OPTIONS,
	url: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DATABASE}`
};
