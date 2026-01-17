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
            // Thay đổi container: Nền trắng, viền xám, bo góc nhẹ (lg thay vì 2xl), shadow cực nhẹ
			className={`bg-white border border-gray-200 md:rounded-lg shadow-sm overflow-hidden mb-6 ${className}`}
		>
			{/* Header: Giảm padding, border mảnh hơn */}
			<div className='px-5 py-4 border-b border-gray-100'>
				<div className='flex flex-col gap-4'>
					<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
						<div className='flex items-center gap-3'>
							{icon && (
                                // Icon Wrapper: Thay gradient bằng khối xám nhạt (Technical look)
								<div className='w-9 h-9 bg-gray-50 border border-gray-200 rounded flex items-center justify-center text-gray-700'>
									{/* Clone element để đảm bảo kích thước icon bên trong phù hợp nếu cần, hoặc render trực tiếp */}
                                    {/* Lưu ý: Các component cha đã truyền icon có class text-black/white, wrapper này sẽ làm nền tảng */}
									{icon}
								</div>
							)}
							<div>
								<h2 className='text-lg font-bold text-gray-900 tracking-tight leading-none'>
                                    {title}
                                </h2>
								{subtitle && (
                                    <p className='text-xs text-gray-500 mt-1 font-medium'>
                                        {subtitle}
                                    </p>
                                )}
							</div>
						</div>
						{headerRight && (
                            <div className='flex items-center gap-3'>
                                {headerRight}
                            </div>
                        )}
					</div>
				</div>
			</div>
            {/* Nội dung bên dưới giữ nguyên logic render */}
			<div className="w-full">
				{children}
			</div>
		</section>
	);
}
