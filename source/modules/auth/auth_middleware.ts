import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { JwtPayload } from 'jsonwebtoken';
import Admin from '../collections/admin/admin_model';
import { AuthService } from './auth_service';

declare global {
	namespace Express {
		interface Request {
			decoded: string;
		}
	}
}
declare module 'jsonwebtoken' {
	export interface JwtCustomPayload extends JwtPayload {
		id: string;
	}
}

export class AuthMiddleware {
	service: AuthService;

	constructor() {
		this.service = new AuthService();
	}

	protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
		let token;

		if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
			try {
				// Get token from header
				token = req.headers.authorization.split(' ')[1];

				// Verify token
				const decoded = this.service.verifyToken(token);
				req.decoded = decoded.id;

				next();
			} catch (err) {
				// Send 401 status if token is not valid
				res.status(401).json({ message: 'Authorization expired.' });
			}
		} else {
			// Send 401 status if token is not available
			res.status(401).json({ message: 'You are not authorized to access this resource.' });
		}
	});

	adminOnly = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
		const user = await Admin.findById(req.decoded);
		if (user && user.role === 'super') {
			next();
		} else {
			res.status(401).json({ message: 'You are not authorized to access this resource.' });
		}
	});
}
