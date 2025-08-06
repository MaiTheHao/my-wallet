import { HTTPSTATUS } from '../const/http-status';
import { TResponseData } from '../types/response.type';
import { NextResponse } from 'next/server';

export class ResponseService {
	static json<T>(
		data: TResponseData<T>,
		status: HTTPSTATUS = HTTPSTATUS.OK,
		headers: Record<string, string> = { 'Content-Type': 'application/json' }
	) {
		return new NextResponse(JSON.stringify(data), {
			status,
			headers,
		});
	}

	static success<T>(data: T, message?: string, status: HTTPSTATUS = HTTPSTATUS.OK) {
		return this.json({ success: true, data, message }, status);
	}

	static created<T>(data: T, message?: string) {
		return this.json({ success: true, data, message }, HTTPSTATUS.CREATED);
	}

	static accepted<T>(data: T, message?: string) {
		return this.json({ success: true, data, message }, HTTPSTATUS.ACCEPTED);
	}

	static noContent(message?: string) {
		return this.json({ success: true, message }, HTTPSTATUS.NO_CONTENT);
	}

	static error(error: string, status: HTTPSTATUS = HTTPSTATUS.INTERNAL_ERROR) {
		return this.json({ success: false, error }, status);
	}

	static badRequest(error: string) {
		return this.error(error, HTTPSTATUS.BAD_REQUEST);
	}

	static unauthorized(error: string) {
		return this.error(error, HTTPSTATUS.UNAUTHORIZED);
	}

	static forbidden(error: string) {
		return this.error(error, HTTPSTATUS.FORBIDDEN);
	}

	static notFound(error: string) {
		return this.error(error, HTTPSTATUS.NOT_FOUND);
	}

	static conflict(error: string) {
		return this.error(error, HTTPSTATUS.CONFLICT);
	}

	static unprocessableEntity(error: string) {
		return this.error(error, HTTPSTATUS.UNPROCESSABLE_ENTITY);
	}

	static internalError(error: string) {
		return this.error(error, HTTPSTATUS.INTERNAL_ERROR);
	}

	static badGateway(error: string) {
		return this.error(error, HTTPSTATUS.BAD_GATEWAY);
	}

	static serviceUnavailable(error: string) {
		return this.error(error, HTTPSTATUS.SERVICE_UNAVAILABLE);
	}
}
