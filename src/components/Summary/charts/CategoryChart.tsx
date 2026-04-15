'use client';
import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
	balance: Record<string, number>;
	formatAmount: (amount: number) => string;
}

const CATEGORY_COLORS = [
	'#6366f1', // Indigo
	'#8b5cf6', // Violet
	'#ec4899', // Pink
	'#f97316', // Orange
	'#eab308', // Yellow
	'#06b6d4', // Cyan
	'#10b981', // Emerald
	'#3b82f6', // Blue
	'#f43f5e', // Rose
	'#84cc16', // Lime
	'#a855f7', // Purple
	'#f59e0b', // Amber
	'#0ea5e9', // Sky
	'#14b8a6', // Teal
	'#64748b', // Slate
	'#ef4444', // Red
	'#d946ef', // Fuchsia
	'#8b5cf6', // Repeat Violet
	'#22c55e', // Green
	'#facc15', // Yellow 400
];

export function CategoryChart({ balance, formatAmount }: CategoryChartProps) {
	const categoryData = useMemo(() => {
		const categories = Object.keys(balance).filter((key) => key !== 'income' && key !== 'expense' && key !== 'balance');
		const data = categories.map((cat) => balance[cat]);
		const labels = categories.map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1));

		return {
			labels,
			datasets: [
				{
					data,
					backgroundColor: CATEGORY_COLORS,
					borderWidth: 0,
					hoverOffset: 15,
					borderRadius: 4,
					cutout: '75%',
				},
			],
		};
	}, [balance]);

	const chartOptions = useMemo(
		() => ({
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: true,
					position: 'bottom' as const,
					labels: {
						usePointStyle: true,
						pointStyle: 'circle',
						padding: 20,
						font: { size: 12, weight: '600' },
					},
				},
				tooltip: {
					backgroundColor: 'rgba(17, 24, 39, 0.95)',
					padding: 14,
					cornerRadius: 12,
					callbacks: {
						label: (context: TooltipItem<'doughnut'>) => {
							const value = context.raw as number;
							return ` ${formatAmount(value)} đ`;
						},
					},
				},
			},
		}),
		[formatAmount],
	);

	if (categoryData.labels.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center p-10 text-gray-400'>
				<span className='text-sm font-medium'>Không có dữ liệu danh mục</span>
			</div>
		);
	}

	return (
		<div className='relative flex flex-col items-center justify-center'>
			<div className='w-[260px] h-[340px] md:w-[320px] md:h-[400px] relative z-10'>
				<Doughnut data={categoryData} options={chartOptions as any} />
			</div>
		</div>
	);
}
