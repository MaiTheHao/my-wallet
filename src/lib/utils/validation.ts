import { ErrorFirst } from '../types/error-first.type';
import { removeCodeBlockMarkers } from './markdown';

export function isJson(jsonString: string): ErrorFirst<object> {
	try {
		const cleaned = removeCodeBlockMarkers(jsonString);
		const result = JSON.parse(cleaned);
		return [null, result];
	} catch {
		return [new Error('Invalid JSON'), null];
	}
}
