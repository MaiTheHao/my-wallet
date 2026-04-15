'use client';
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { generateFinancialInsight, InsightLevel } from '../utils';

interface SummaryStatsProps {
	totalIncome: number;
	totalExpense: number;
	currentBalance: number;
	savingRate: string | number;
	formatAmount: (amount: number) => string;
}

const LEVEL_STYLES: Record<InsightLevel, { dot: string; text: string; bg: string; border: string }> = {
	danger: {
		dot: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]',
		text: 'text-red-600',
		bg: 'bg-red-50/30',
		border: 'border-red-100/50',
	},
	warning: {
		dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]',
		text: 'text-amber-600',
		bg: 'bg-amber-50/30',
		border: 'border-amber-100/50',
	},
	neutral: {
		dot: 'bg-gray-400 shadow-[0_0_8px_rgba(156,163,175,0.4)]',
		text: 'text-gray-500',
		bg: 'bg-gray-50/50',
		border: 'border-gray-100/50',
	},
	good: {
		dot: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]',
		text: 'text-green-600',
		bg: 'bg-green-50/30',
		border: 'border-green-100/50',
	},
	excellent: {
		dot: 'bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]',
		text: 'text-indigo-600',
		bg: 'bg-indigo-50/30',
		border: 'border-indigo-100/50',
	},
};

export function SummaryStats({ totalIncome, totalExpense, currentBalance, savingRate, formatAmount }: SummaryStatsProps) {
	const insight = generateFinancialInsight({ income: totalIncome, expense: totalExpense });
	const style = LEVEL_STYLES[insight.level];

	return (
		<div className='flex flex-col justify-center space-y-8'>
			<div className='grid grid-cols-1 gap-3'>
				<div className='flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100/50 transition-all hover:bg-white hover:border-green-100 hover:shadow-sm'>
					<div className='flex items-center gap-3'>
						<div className='text-green-500'>
							<TrendingUp size={18} />
						</div>
						<span className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Thu nhập</span>
					</div>
					<span className='text-lg font-bold text-green-600 font-mono tracking-tight'>+{formatAmount(totalIncome)}</span>
				</div>

				<div className='flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100/50 transition-all hover:bg-white hover:border-red-100 hover:shadow-sm'>
					<div className='flex items-center gap-3'>
						<div className='text-red-500'>
							<TrendingDown size={18} />
						</div>
						<span className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Chi tiêu</span>
					</div>
					<span className='text-lg font-bold text-red-600 font-mono tracking-tight'>-{formatAmount(totalExpense)}</span>
				</div>
			</div>

			<div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 ${style.bg} ${style.border}`}>
				<div className={`w-2 h-2 rounded-full animate-pulse transition-all duration-500 ${style.dot}`} />
				<div className='flex items-center divide-x divide-gray-200 gap-3'>
					<span className={`text-xs font-bold ${style.text}`}>Tiết kiệm: {savingRate}%</span>
					<span className={`pl-3 text-xs font-medium transition-colors duration-500 ${style.text}`}>
						{insight.message}
					</span>
				</div>
			</div>
		</div>
	);
}
