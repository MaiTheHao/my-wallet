import appConfig from '@/app.config';
import api from '@/lib/const/api';
import { TResponseData } from '@/lib/types/response.type';

const API_BASE_URL = appConfig.api.getFullApiUrl();

export class AiApiService {
	static async chat(message: string): Promise<TResponseData<{ reply: string }>> {
		const res = await fetch(`${API_BASE_URL}/${api.chat}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				message,
			}),
		});
		return res.json();
	}
}
