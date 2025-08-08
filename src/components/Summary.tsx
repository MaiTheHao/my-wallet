'use client';
import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet, PiggyBank, Receipt } from 'lucide-react';
import { Section } from './Section';
import { useBalanceContext } from '@/context/balance-context/useBalanceContext';

export function Summary() {
	const { balance, balanceLoading, balanceError } = useBalanceContext();

	const totalIncome = balance?.income ?? 0;
	const totalExpense = balance?.expense ?? 0;
	const currentBalance = totalIncome - totalExpense;
	const status = {
		positive: currentBalance > 0,
		negative: currentBalance < 0,
		zero: currentBalance === 0,
	};

	const formatAmount = (amount: number) => amount.toLocaleString('vi-VN') + 'đ';

	const balanceColor = status.positive ? 'text-green-600' : status.negative ? 'text-red-500' : 'text-gray-700';

	const StatusIcon = status.positive ? ArrowUpCircle : status.negative ? ArrowDownCircle : Wallet;

	return (
		<Section
			title='Tổng Quan Ví'
			subtitle='Số dư hiện tại, thu nhập và chi tiêu'
			id='summary'
			className='mb-8'
			icon={<Wallet size={20} className='text-white' />}
		>
			<div className='flex flex-col items-center bg-white rounded-xl px-6 py-8 md:px-10 md:py-12'>
				<div className='flex flex-row items-center gap-2 mb-4'>
					<span className={`text-4xl md:text-5xl font-bold leading-none ${balanceColor}`}>
						{balanceLoading ? '...' : formatAmount(currentBalance)}
					</span>
				</div>
				<div className='flex gap-6 w-full justify-center mt-2'>
					<div className='flex flex-col items-center'>
						<span className='flex items-center gap-1 text-xs text-gray-500 mb-1'>
							<PiggyBank size={14} className='text-green-500' />
							Thu nhập
						</span>
						<span className='flex items-center gap-1 text-lg font-semibold text-green-600'>
							<ArrowUpCircle size={16} />
							{balanceLoading ? '...' : formatAmount(totalIncome)}
						</span>
					</div>
					<div className='flex flex-col items-center'>
						<span className='flex items-center gap-1 text-xs text-gray-500 mb-1'>
							<Receipt size={14} className='text-red-500' />
							Chi tiêu
						</span>
						<span className='flex items-center gap-1 text-lg font-semibold text-red-500'>
							<ArrowDownCircle size={16} />
							{balanceLoading ? '...' : formatAmount(totalExpense)}
						</span>
					</div>
				</div>
				{balanceError && <div className='text-red-500 text-sm mt-4'>{balanceError}</div>}
			</div>
		</Section>
	);
}
