import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

interface IAuthService {
	generateToken(id: string): string;
	verifyToken(token: string): any;
	hashPW(password: string): Promise<string>;
	comparePW(password: string, hashedPassword: string): Promise<boolean>;
}

export class AuthService implements IAuthService {
	generateToken(id: string) {
		return jwt.sign({ id }, process.env.JWT_SECRET || '', {
			expiresIn: process.env.JWT_EXPIRES_IN
		});
	}

	verifyToken(token: string) {
		return <jwt.JwtCustomPayload>jwt.verify(token, process.env.JWT_SECRET || '');
	}

	hashPW = async (password: string) => {
		return new Promise<string>((resolve) => {
			bcrypt.genSalt(10).then((salt) => {
				bcrypt.hash(password, salt).then((hashedPassword) => {
					resolve(hashedPassword);
				});
			});
		});
	};

	comparePW = async (password: string, hashedPassword: string) => {
		return new Promise<boolean>((resolve) => {
			bcrypt.compare(password, hashedPassword).then((result) => {
				resolve(result);
			});
		});
	};
}
