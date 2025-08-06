import React from 'react';

interface TransactionFilterProps {
	activeFilter: 'all' | 'income' | 'expense';
	onFilterChange: (filter: 'all' | 'income' | 'expense') => void;
}

export function TransactionFilter({ activeFilter, onFilterChange }: TransactionFilterProps) {
	const filters = [
		{ key: 'all' as const, label: 'Tất cả', icon: '📊', color: 'bg-slate-500' },
		{ key: 'income' as const, label: 'Thu nhập', icon: '📈', color: 'bg-green-500' },
		{ key: 'expense' as const, label: 'Chi tiêu', icon: '📉', color: 'bg-red-500' },
	];

	return (
		<div className='flex gap-2 flex-wrap'>
			{filters.map((filter) => (
				<button
					key={filter.key}
					onClick={() => onFilterChange(filter.key)}
					className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
						activeFilter === filter.key
							? `${filter.color} text-white shadow-md`
							: 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
					}`}
				>
					<span>{filter.icon}</span>
					{filter.label}
				</button>
			))}
		</div>
	);
}
