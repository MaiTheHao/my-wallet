'use client';
import React from 'react';
import { LayoutDashboard, PieChart } from 'lucide-react';
import { ChartType } from '../types';

interface SummaryNavbarProps {
	activeTab: ChartType;
	onTabChange: (tab: ChartType) => void;
}

export function SummaryNavbar({ activeTab, onTabChange }: SummaryNavbarProps) {
	const tabs = [
		{ id: 'overview' as ChartType, label: 'Tổng quan', icon: LayoutDashboard },
		{ id: 'categories' as ChartType, label: 'Danh mục', icon: PieChart },
	];

	return (
		<div className='flex p-1 bg-gray-100/80 rounded-xl mb-6 self-start backdrop-blur-sm border border-gray-200'>
			{tabs.map((tab) => {
				const Icon = tab.icon;
				const isActive = activeTab === tab.id;
				return (
					<button
						key={tab.id}
						onClick={() => onTabChange(tab.id)}
						className={`
							relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
							${isActive ? 'bg-white text-black shadow-sm ring-1 ring-gray-900/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'}
						`}
					>
						<Icon size={16} />
						{tab.label}
					</button>
				);
			})}
		</div>
	);
}
