'use client';
export function useEventEmitter<T = any>() {
	return {
		on: (event: string, listener: (payload: T) => void) => {
			const handler = (e: Event) => {
				listener((e as CustomEvent<T>).detail);
			};
			document.addEventListener(event, handler);
			return handler;
		},
		off: (event: string, handler: EventListenerOrEventListenerObject) => {
			document.removeEventListener(event, handler);
		},
		emit: (event: string, payload: T) => {
			document.dispatchEvent(new CustomEvent(event, { detail: payload }));
		},
	};
}
