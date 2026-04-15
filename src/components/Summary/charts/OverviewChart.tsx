'use client';
import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface OverviewChartProps {
	totalIncome: number;
	totalExpense: number;
	currentBalance: number;
	formatAmount: (amount: number) => string;
}

export function OverviewChart({ totalIncome, totalExpense, currentBalance, formatAmount }: OverviewChartProps) {
	const isPositive = currentBalance >= 0;

	const chartData = useMemo(
		() => ({
			labels: ['Thu nhập', 'Chi tiêu'],
			datasets: [
				{
					data: [totalIncome, totalExpense],
					backgroundColor: ['#10b981', '#f43f5e'],
					hoverBackgroundColor: ['#059669', '#e11d48'],
					borderWidth: 0,
					hoverOffset: 15,
					borderRadius: 4,
					cutout: '82%',
				},
			],
		}),
		[totalIncome, totalExpense],
	);

	const chartOptions = useMemo(
		() => ({
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: { display: false },
				tooltip: {
					backgroundColor: 'rgba(17, 24, 39, 0.95)',
					padding: 14,
					cornerRadius: 12,
					titleFont: { family: 'ui-sans-serif, system-ui', size: 13 },
					bodyFont: { family: 'ui-sans-serif, system-ui', size: 13, weight: 'bold' },
					callbacks: {
						label: (context: TooltipItem<'doughnut'>) => {
							const value = context.raw as number;
							return ` ${formatAmount(value)} đ`;
						},
					},
				},
			},
			animation: {
				animateScale: true,
				animateRotate: true,
			},
		}),
		[formatAmount],
	);

	return (
		<div className='relative flex flex-col items-center justify-center'>
			<div className='w-[260px] h-[260px] md:w-[320px] md:h-[320px] relative z-10'>
				<Doughnut data={chartData} options={chartOptions as any} />

				<div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
					<span className='text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mb-1'>Số dư thực</span>
					<span className={`text-2xl md:text-4xl font-black tracking-tighter font-mono ${isPositive ? 'text-gray-900' : 'text-red-500'}`}>
						{formatAmount(currentBalance)}
					</span>
					<span className='text-[10px] md:text-xs text-gray-400 font-medium mt-1 bg-gray-50 px-2 py-0.5 rounded-full'>VNĐ</span>
				</div>
			</div>
		</div>
	);
}
