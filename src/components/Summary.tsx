'use client';
import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet2 } from 'lucide-react';
import { Section } from './Section';
import { useTransactionContext } from '@/context/transaction-context/useTransactionContext';

export function Summary() {
	const { transactions, loading } = useTransactionContext();

	const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

	const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

	const balance = totalIncome - totalExpense;

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
						{loading ? '...' : formatAmount(totalIncome)}
					</div>
				</div>
				<div className='flex flex-col items-center justify-center gap-2 bg-white rounded-xl shadow-sm border border-slate-200 py-6'>
					<ArrowDownCircle size={32} className='text-red-500 mb-2' />
					<div className='text-xs text-slate-500 font-medium'>Tổng Chi Tiêu</div>
					<div className='text-2xl font-bold text-red-600'>
						{loading ? '...' : formatAmount(totalExpense)}
					</div>
				</div>
				{/* <div className='flex flex-col items-center justify-center gap-2 bg-white rounded-xl shadow-sm border border-slate-200 py-6'>
					<Wallet2 size={32} className='text-blue-500 mb-2' />
					<div className='text-xs text-slate-500 font-medium'>Số Dư Hiện Tại</div>
					<div className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
						{loading ? '...' : formatAmount(balance)}
					</div>
				</div> */}
			</div>
		</Section>
	);
}
