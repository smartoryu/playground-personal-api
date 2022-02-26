import { TReturnService } from '.';

export const resNotFound = (NAMESPACE: string): TReturnService => ({ code: 404, message: NAMESPACE + ' Not Found' });
export const resConflict = (message: string): TReturnService => ({ code: 409, message });
