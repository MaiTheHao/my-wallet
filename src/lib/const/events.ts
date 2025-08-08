export const CLIENT_EVENTS = {
	TRANSACTION_CREATED: 'transaction:created',
	TRANSACTION_DELETED: 'transaction:deleted',
	BALANCE_UPDATED: 'balance:updated',
} as const;

export type ClientEvent = (typeof CLIENT_EVENTS)[keyof typeof CLIENT_EVENTS];
