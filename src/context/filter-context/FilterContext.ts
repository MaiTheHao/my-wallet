import { createContext } from 'react';

export type TimeRange = 'all' | 'week' | 'month';

export interface FilterContextState {
	timeRange: TimeRange;
	search: string;
	setTimeRange: (range: TimeRange) => void;
	setSearch: (query: string) => void;
}

export const FilterContext = createContext<FilterContextState | undefined>(undefined);
