import bcrypt from 'bcrypt';

/**
 * Hash password
 * @param password to be hashed
 * @returns hashed password
 */
export const hashPassword = async (password: string) => {
	return new Promise<string>((resolve) => {
		bcrypt.genSalt(10).then((salt) => {
			bcrypt.hash(password, salt).then((hashedPassword) => {
				resolve(hashedPassword);
			});
		});
	});
};
