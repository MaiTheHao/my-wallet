export type TResponseData<T = any> = {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
};
