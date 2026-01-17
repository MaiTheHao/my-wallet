'use client';
import React from 'react';
import { 
    Wallet, 
    TrendingUp, 
    TrendingDown, 
    DollarSign 
} from 'lucide-react';
import { Section } from './Section';
import { useBalanceContext } from '@/context/balance-context/useBalanceContext';

export function Summary() {
	const { balance, balanceLoading, balanceError } = useBalanceContext();

	const totalIncome = balance?.income ?? 0;
	const totalExpense = balance?.expense ?? 0;
	const currentBalance = totalIncome - totalExpense;

	const formatAmount = (amount: number) => {
        // Dùng font mono nên format khoảng cách cho dễ đọc
        return new Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(amount);
    };

	return (
		<Section
			title='Tổng quan ví'
			subtitle='Tình hình tài chính hiện tại'
			id='summary'
			className='mb-6'
            // Icon section màu đen
			icon={<Wallet size={18} className='text-black' />}
		>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				
                {/* CARD 1: SỐ DƯ HIỆN TẠI (Main Card - Dark Theme) */}
				<div className='bg-gray-900 text-white rounded-lg p-5 flex flex-col justify-between min-h-[120px] shadow-md shadow-gray-200'>
					<div className='flex items-start justify-between'>
						<span className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
							Số dư khả dụng
						</span>
						<div className='p-1.5 bg-gray-800 rounded text-gray-300'>
                            <Wallet size={16} />
                        </div>
					</div>
					
                    <div className='mt-2'>
                        {balanceLoading ? (
                            <div className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
                        ) : (
                            <div className='flex items-baseline gap-1'>
                                <span className='text-3xl font-mono font-bold tracking-tight'>
                                    {formatAmount(currentBalance)}
                                </span>
                                <span className='text-sm font-medium text-gray-400'>đ</span>
                            </div>
                        )}
                        {balanceError && <p className='text-xs text-red-400 mt-1'>Lỗi tải dữ liệu</p>}
                    </div>
				</div>

                {/* CARD 2: TỔNG THU (Light Card) */}
				<div className='bg-white border border-gray-200 rounded-lg p-5 flex flex-col justify-between min-h-[120px] hover:border-gray-300 transition-colors'>
					<div className='flex items-start justify-between'>
						<span className='text-xs font-semibold uppercase tracking-wider text-gray-500'>
							Tổng thu nhập
						</span>
						{/* Icon xu hướng đi lên */}
                        <div className='p-1.5 bg-green-50 rounded text-green-600 border border-green-100'>
						    <TrendingUp size={16} />
                        </div>
					</div>
                    
                    <div className='mt-2'>
                        {balanceLoading ? (
                             <div className="h-8 w-24 bg-gray-100 rounded animate-pulse"></div>
                        ) : (
                            <div className='flex items-baseline gap-1'>
                                <span className='text-2xl font-mono font-bold text-gray-900 tracking-tight'>
                                    +{formatAmount(totalIncome)}
                                </span>
                                <span className='text-xs font-medium text-gray-400'>đ</span>
                            </div>
                        )}
                    </div>
				</div>

                {/* CARD 3: TỔNG CHI (Light Card) */}
				<div className='bg-white border border-gray-200 rounded-lg p-5 flex flex-col justify-between min-h-[120px] hover:border-gray-300 transition-colors'>
					<div className='flex items-start justify-between'>
						<span className='text-xs font-semibold uppercase tracking-wider text-gray-500'>
							Tổng chi tiêu
						</span>
                        {/* Icon xu hướng đi xuống */}
						<div className='p-1.5 bg-red-50 rounded text-red-600 border border-red-100'>
                            <TrendingDown size={16} />
                        </div>
					</div>

                    <div className='mt-2'>
                        {balanceLoading ? (
                             <div className="h-8 w-24 bg-gray-100 rounded animate-pulse"></div>
                        ) : (
                            <div className='flex items-baseline gap-1'>
                                <span className='text-2xl font-mono font-bold text-gray-900 tracking-tight'>
                                    -{formatAmount(totalExpense)}
                                </span>
                                <span className='text-xs font-medium text-gray-400'>đ</span>
                            </div>
                        )}
                    </div>
				</div>
			</div>
		</Section>
	);
}
