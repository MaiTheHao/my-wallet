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
		<section
			id={id}
			className={`bg-white/70 backdrop-blur-sm md:rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/30 overflow-hidden ${className}`}
		>
			<div className='p-8 border-b border-slate-200/50'>
				<div className='flex flex-col gap-6'>
					<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
						<div className='flex items-center gap-3'>
							{icon && (
								<div className='w-10 h-10 aspect-square bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center'>
									{icon}
								</div>
							)}
							<div>
								<h2 className='text-xl md:text-2xl font-bold text-slate-800'>{title}</h2>
								{subtitle && <p className='text-slate-600 text-sm'>{subtitle}</p>}
							</div>
						</div>
						{headerRight && <div className='flex items-center gap-4'>{headerRight}</div>}
					</div>
				</div>
			</div>
			{children}
		</section>
	);
}
