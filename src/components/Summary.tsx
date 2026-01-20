'use client';
import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Activity, PieChart } from 'lucide-react';
import { Section } from './Section';
import { useBalanceContext } from '@/context/balance-context/useBalanceContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export function Summary() {
	const { balance, balanceLoading } = useBalanceContext();

	const totalIncome = balance?.income ?? 0;
	const totalExpense = balance?.expense ?? 0;
	const currentBalance = totalIncome - totalExpense;

	const formatAmount = (amount: number) => {
		return new Intl.NumberFormat('vi-VN').format(amount);
	};

	const chartData = useMemo(
		() => ({
			labels: ['Thu nhập', 'Chi tiêu'],
			datasets: [
				{
					data: [totalIncome, totalExpense],
					// Modern Palette: Emerald (Income) vs Rose (Expense)
					backgroundColor: ['#10b981', '#f43f5e'],
					hoverBackgroundColor: ['#059669', '#e11d48'],
					borderWidth: 0,
					hoverOffset: 15, // Tăng hiệu ứng hover pop-out
					borderRadius: 4, // Bo nhẹ các segment
					cutout: '82%', // Vòng tròn mỏng tinh tế
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
				legend: { display: false }, // Tắt legend mặc định để tự custom
				tooltip: {
					backgroundColor: 'rgba(17, 24, 39, 0.95)',
					padding: 14,
					cornerRadius: 12,
					titleFont: { family: 'ui-sans-serif, system-ui', size: 13 },
					bodyFont: { family: 'ui-sans-serif, system-ui', size: 13, weight: 'bold' },
					callbacks: {
						label: (context: TooltipItem<'doughnut'>) => {
							const value = context.raw as number;
							return ` ${new Intl.NumberFormat('vi-VN').format(value)} đ`;
						},
					},
				},
			},
			animation: {
				animateScale: true,
				animateRotate: true,
			},
		}),
		[],
	);

	// Tính tỷ lệ tiết kiệm
	const savingRate = totalIncome > 0 ? ((currentBalance / totalIncome) * 100).toFixed(1) : 0;
	const isPositive = currentBalance >= 0;

	return (
		<Section
			title='Phân tích tài chính'
			subtitle='Báo cáo hiệu suất dòng tiền'
			id='summary'
			icon={<Activity size={20} className='text-gray-900' />}
			// Thêm min-height để lấp đầy khoảng trống khi bỏ 3 card cũ
			className='min-h-[420px] flex flex-col justify-center'
		>
			{balanceLoading ? (
				<div className='flex flex-col items-center justify-center py-20 gap-4'>
					<div className='w-10 h-10 border-2 border-gray-100 border-t-black rounded-full animate-spin' />
					<span className='text-sm text-gray-400 font-medium animate-pulse'>Đang tổng hợp dữ liệu...</span>
				</div>
			) : totalIncome === 0 && totalExpense === 0 ? (
				<div className='flex flex-col items-center justify-center py-20 text-gray-400'>
					<div className='bg-gray-50 p-6 rounded-full mb-4 animate-in fade-in zoom-in duration-500'>
						<PieChart size={40} className='text-gray-300' strokeWidth={1.5} />
					</div>
					<h3 className='text-gray-900 font-medium'>Chưa có dữ liệu</h3>
					<p className='text-sm mt-1 max-w-xs text-center leading-relaxed'>Hãy thử nhập một giao dịch vào khung chat bên dưới để xem biểu đồ.</p>
				</div>
			) : (
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center w-full px-2 md:px-6 py-4'>
					{/* LEFT COLUMN: THE CHART */}
					<div className='relative flex flex-col items-center justify-center order-1 lg:order-1'>
						{/* Chart Container */}
						<div className='w-[260px] h-[260px] md:w-[320px] md:h-[320px] relative z-10'>
							<Doughnut data={chartData} options={chartOptions as any} />

							{/* Central Balance Info */}
							<div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-700'>
								<span className='text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mb-1'>Số dư thực</span>
								<span className={`text-2xl md:text-4xl font-black tracking-tighter font-mono ${isPositive ? 'text-gray-900' : 'text-red-500'}`}>
									{formatAmount(currentBalance)}
								</span>
								<span className='text-[10px] md:text-xs text-gray-400 font-medium mt-1 bg-gray-50 px-2 py-0.5 rounded-full'>VNĐ</span>
							</div>
						</div>
					</div>

					{/* RIGHT COLUMN: DETAILED BREAKDOWN */}
					<div className='flex flex-col justify-center space-y-8 order-2 lg:order-2'>
						{/* Stats List */}
						<div className='space-y-4'>
							{/* Income Row */}
							<div className='group flex items-center justify-between p-4 md:p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-green-100 hover:border-green-100'>
								<div className='flex items-center gap-4'>
									<div className='w-12 h-12 rounded-xl bg-white flex items-center justify-center text-green-500 shadow-sm border border-gray-50 group-hover:scale-110 transition-transform'>
										<TrendingUp size={22} />
									</div>
									<div className='flex flex-col'>
										<span className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Tổng thu nhập</span>
										<span className='text-sm text-gray-500 font-medium'>Dòng tiền vào</span>
									</div>
								</div>
								<span className='text-xl md:text-2xl font-bold text-green-600 font-mono tracking-tight'>+{formatAmount(totalIncome)}</span>
							</div>

							{/* Expense Row */}
							<div className='group flex items-center justify-between p-4 md:p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-red-100 hover:border-red-100'>
								<div className='flex items-center gap-4'>
									<div className='w-12 h-12 rounded-xl bg-white flex items-center justify-center text-red-500 shadow-sm border border-gray-50 group-hover:scale-110 transition-transform'>
										<TrendingDown size={22} />
									</div>
									<div className='flex flex-col'>
										<span className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Tổng chi tiêu</span>
										<span className='text-sm text-gray-500 font-medium'>Dòng tiền ra</span>
									</div>
								</div>
								<span className='text-xl md:text-2xl font-bold text-red-600 font-mono tracking-tight'>-{formatAmount(totalExpense)}</span>
							</div>
						</div>

						{/* Insight Block */}
						<div className='relative pl-5 py-2'>
							{/* Decorative vertical line */}
							<div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full ${isPositive ? 'bg-black' : 'bg-red-500'}`} />

							<div className='flex items-center justify-between mb-2'>
								<span className='text-sm font-bold text-gray-900'>Nhận định</span>
								<span
									className={`text-xs font-bold px-2 py-1 rounded-md border ${Number(savingRate) >= 0 ? 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-red-50 text-red-600 border-red-100'}`}
								>
									Tiết kiệm: {savingRate}%
								</span>
							</div>

							<p className='text-sm text-gray-600 leading-relaxed font-medium'>
								{currentBalance > 0
									? 'Tình hình tài chính tích cực.'
									: currentBalance < 0
										? 'Cảnh báo thâm hụt. Chi tiêu đang vượt quá thu nhập.'
										: 'Thu chi cân bằng. Tình hình ổn định nhưng chưa có tích lũy.'}
							</p>
						</div>
					</div>
				</div>
			)}
		</Section>
	);
}
