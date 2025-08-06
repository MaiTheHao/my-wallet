'use client';
import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet2 } from 'lucide-react';
import { Section } from './Section';
import { useBalanceContext } from '@/context/balance-context/useBalanceContext';

export function Summary() {
	const { balance, balanceLoading, balanceError } = useBalanceContext();

	const totalIncome = balance?.income ?? 0;
	const totalExpense = balance?.expense ?? 0;
	const currentBalance = totalIncome - totalExpense;

	const formatAmount = (amount: number) => amount.toLocaleString('vi-VN') + 'đ';

	return (
		<Section
			icon={<Wallet2 className='text-white' size={28} />}
			title='Tổng Quan Ví'
			subtitle='Tổng thu nhập, chi tiêu và số dư hiện tại'
			id='summary'
			className='mb-8'
		>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-xl'>
				<div className='flex flex-col items-center justify-center gap-2 bg-white rounded-xl shadow-sm border border-slate-200 py-6'>
					<ArrowUpCircle size={32} className='text-green-500 mb-2' />
					<div className='text-xs text-slate-500 font-medium'>Tổng Thu Nhập</div>
					<div className='text-2xl font-bold text-green-600'>
						{balanceLoading ? '...' : formatAmount(totalIncome)}
					</div>
				</div>
				<div className='flex flex-col items-center justify-center gap-2 bg-white rounded-xl shadow-sm border border-slate-200 py-6'>
					<ArrowDownCircle size={32} className='text-red-500 mb-2' />
					<div className='text-xs text-slate-500 font-medium'>Tổng Chi Tiêu</div>
					<div className='text-2xl font-bold text-red-600'>
						{balanceLoading ? '...' : formatAmount(totalExpense)}
					</div>
				</div>
			</div>
			{balanceError && <div className='text-red-500 text-sm mt-2'>Lỗi lấy số dư: {balanceError}</div>}
		</Section>
	);
}
