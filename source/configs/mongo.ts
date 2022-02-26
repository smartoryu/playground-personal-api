import mongoose from 'mongoose';

const MONGO_OPTIONS: mongoose.ConnectOptions = {
	keepAlive: true,
	retryWrites: false,
	w: 'majority'
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || 'prikenang';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'bahagia';
const MONGO_HOST = process.env.MONGO_HOST || `personalcluster.beytk.mongodb.net`;
const MONGO_DATABASE = process.env.MONGO_DATABASE || 'personaldb';

interface IMongoConfig {
	host: string;
	password: string;
	username: string;
	options: mongoose.ConnectOptions;
	uri: string;
}

export const MONGO: IMongoConfig = {
	host: MONGO_HOST,
	password: MONGO_PASSWORD,
	username: MONGO_USERNAME,
	options: MONGO_OPTIONS,
	uri: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DATABASE}`
};
