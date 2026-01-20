import React from 'react';

interface SectionProps {
	icon?: React.ReactNode;
	title: string;
	subtitle?: string;
	children: React.ReactNode;
	headerRight?: React.ReactNode;
	className?: string;
	id?: string;
}

export function Section({ icon, title, subtitle, children, headerRight, className = '', id }: SectionProps) {
	return (
		<section id={id} className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6 ${className}`}>
			{/* Header */}
			<div className='px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
				<div className='flex items-center gap-3'>
					{icon && <div className='w-9 h-9 bg-gray-50 border border-gray-200 rounded flex items-center justify-center text-gray-700 shrink-0'>{icon}</div>}
					<div>
						<h2 className='text-lg font-bold text-gray-900 tracking-tight'>{title}</h2>
						{subtitle && <p className='text-xs text-gray-500 mt-1 font-medium'>{subtitle}</p>}
					</div>
				</div>
				{headerRight && <div className='shrink-0'>{headerRight}</div>}
			</div>

			{/* Body with padding */}
			<div className='p-4 md:p-6'>{children}</div>
		</section>
	);
}
