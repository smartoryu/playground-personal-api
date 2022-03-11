import { ICronJob, logging } from '../../utils';
import Admin from '../collections/admin/admin_model';

export const cronDeleteGuestAdmin: ICronJob = {
	time: '0 0 0 * * *', // Every end of the day
	action: async () => {
		const guestAdmin = await Admin.find({ role: 'guest' }).exec();
		await Admin.deleteMany({ role: 'guest' }).exec();
		const guestAdminName = guestAdmin.map((admin) => admin.fullname);
		logging.warn('CRON DELETE GUEST', { deleted_admin: guestAdminName });
	}
};
