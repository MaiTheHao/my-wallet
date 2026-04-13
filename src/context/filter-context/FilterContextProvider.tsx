'use client';
import React, { useState } from 'react';
import { FilterContext, TimeRange } from './FilterContext';

export function FilterContextProvider({ children }: { children: React.ReactNode }) {
	const [timeRange, setTimeRange] = useState<TimeRange>('all');
	const [search, setSearch] = useState('');

	return (
		<FilterContext.Provider value={{ timeRange, search, setTimeRange, setSearch }}>
			{children}
		</FilterContext.Provider>
	);
}
