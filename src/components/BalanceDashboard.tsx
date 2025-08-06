import React from 'react';
import { BalanceInfo } from '@/types/transaction.types';

interface BalanceDashboardProps {
	balance: BalanceInfo;
	loading: boolean;
}

export function BalanceDashboard({ balance, loading }: BalanceDashboardProps) {
	if (loading) {
		return (
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{[1, 2, 3].map((i) => (
					<div key={i} className='bg-white/70 rounded-2xl p-6 animate-pulse'>
						<div className='flex items-center justify-between'>
							<div>
								<div className='h-4 bg-slate-200 rounded w-16 mb-2'></div>
								<div className='h-8 bg-slate-200 rounded w-24'></div>
							</div>
							<div className='w-12 h-12 bg-slate-200 rounded-xl'></div>
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
			<div className='bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-green-100 text-sm font-medium'>Thu nhập</p>
						<p className='text-2xl font-bold'>{balance.income.toLocaleString('vi-VN')}đ</p>
					</div>
					<div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center'>
						<span className='text-2xl'>📈</span>
					</div>
				</div>
			</div>

			<div className='bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl p-6 text-white'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-red-100 text-sm font-medium'>Chi tiêu</p>
						<p className='text-2xl font-bold'>{balance.expense.toLocaleString('vi-VN')}đ</p>
					</div>
					<div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center'>
						<span className='text-2xl'>📉</span>
					</div>
				</div>
			</div>

			<div
				className={`rounded-2xl p-6 text-white ${
					balance.balance >= 0
						? 'bg-gradient-to-r from-blue-500 to-purple-600'
						: 'bg-gradient-to-r from-orange-500 to-red-600'
				}`}
			>
				<div className='flex items-center justify-between'>
					<div>
						<p
							className={`text-sm font-medium ${
								balance.balance >= 0 ? 'text-blue-100' : 'text-orange-100'
							}`}
						>
							Số dư
						</p>
						<p className='text-2xl font-bold'>{balance.balance.toLocaleString('vi-VN')}đ</p>
					</div>
					<div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center'>
						<span className='text-2xl'>{balance.balance >= 0 ? '💰' : '⚠️'}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
