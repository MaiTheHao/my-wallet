'use client';
import React, { useState } from 'react';
import { Activity, PieChart } from 'lucide-react';
import { Section } from '../Section';
import { useBalanceContext } from '@/context/balance-context/useBalanceContext';
import { useCategoryStats } from '@/hooks/useCategoryStats';
import { SummaryNavbar } from './ui/SummaryNavbar';
import { SummaryStats } from './ui/SummaryStats';
import { OverviewChart } from './charts/OverviewChart';
import { CategoryChart } from './charts/CategoryChart';
import { ChartType, SummaryProps } from './types';

export function Summary({ className }: SummaryProps) {
	const { balance, balanceLoading } = useBalanceContext();
	const { stats: categoryStats, loading: categoryLoading } = useCategoryStats();
	const [activeTab, setActiveTab] = useState<ChartType>('overview');

	const totalIncome = balance?.income ?? 0;
	const totalExpense = balance?.expense ?? 0;
	const currentBalance = totalIncome - totalExpense;
	const savingRate = totalIncome > 0 ? ((currentBalance / totalIncome) * 100).toFixed(1) : 0;

	const formatAmount = (amount: number) => {
		return new Intl.NumberFormat('vi-VN').format(amount);
	};

	const isLoading = balanceLoading;
	const hasNoData = totalIncome === 0 && totalExpense === 0;

	return (
		<Section
			title='Phân tích tài chính'
			subtitle='Báo cáo hiệu suất dòng tiền'
			id='summary'
			icon={<Activity size={20} className='text-gray-900' />}
			className={`min-h-[420px] flex flex-col justify-center ${className}`}
		>
			{isLoading ? (
				<div className='flex flex-col items-center justify-center py-20 gap-4'>
					<div className='w-10 h-10 border-2 border-gray-100 border-t-black rounded-full animate-spin' />
					<span className='text-sm text-gray-400 font-medium animate-pulse'>Đang tổng hợp dữ liệu...</span>
				</div>
			) : hasNoData ? (
				<div className='flex flex-col items-center justify-center py-20 text-gray-400'>
					<div className='bg-gray-50 p-6 rounded-full mb-4'>
						<PieChart size={40} className='text-gray-300' strokeWidth={1.5} />
					</div>
					<h3 className='text-gray-900 font-medium'>Chưa có dữ liệu</h3>
					<p className='text-sm mt-1 max-w-xs text-center leading-relaxed'>Hãy thử nhập một giao dịch vào khung chat bên dưới để xem biểu đồ.</p>
				</div>
			) : (
				<div className='flex flex-col w-full px-2 md:px-6 py-4'>
					<SummaryNavbar activeTab={activeTab} onTabChange={setActiveTab} />
					
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center'>
						<div className='order-1 flex justify-center'>
							{activeTab === 'overview' ? (
								<OverviewChart
									totalIncome={totalIncome}
									totalExpense={totalExpense}
									currentBalance={currentBalance}
									formatAmount={formatAmount}
								/>
							) : categoryLoading ? (
								<div className='flex flex-col items-center justify-center py-20 gap-4'>
									<div className='w-8 h-8 border-2 border-gray-100 border-t-black rounded-full animate-spin' />
								</div>
							) : (
								<CategoryChart balance={categoryStats ?? {}} formatAmount={formatAmount} />
							)}
						</div>

						<div className='order-2'>
							<SummaryStats
								totalIncome={totalIncome}
								totalExpense={totalExpense}
								currentBalance={currentBalance}
								savingRate={savingRate}
								formatAmount={formatAmount}
							/>
						</div>
					</div>
				</div>
			)}
		</Section>
	);
}
