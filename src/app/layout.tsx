import './globals.css';
import { NotebookPen } from 'lucide-react';
import { metadata } from './root-metadata';

export { metadata };

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='vi'>
			<head />
			{/* BODY: Đổi sang nền xám rất nhẹ (gray-50) để làm nổi bật nội dung chính, text màu đen xám */}
			<body className='bg-gray-50 text-gray-900 font-sans min-h-screen antialiased selection:bg-gray-900 selection:text-white'>
				
				{/* HEADER: Chuyển sang nền trắng tuyệt đối, border mảnh, layout dàn ngang (row) thay vì dọc để tiết kiệm diện tích màn hình */}
				<header className='bg-white border-b border-gray-200 sticky top-0 z-10'>
					<div className='max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between'>
						
						{/* Logo Area: Đơn giản, icon đen tuyền, chữ đậm */}
						<div className='flex items-center gap-3'>
							<div className="bg-gray-900 p-1.5 rounded text-white">
								<NotebookPen className='w-5 h-5' strokeWidth={2} />
							</div>
							<h1 className='text-lg font-bold tracking-tight text-gray-900'>
								Sổ Thu Chi
							</h1>
						</div>

						{/* Slogan: Thu gọn lại, màu xám nhạt, ẩn trên mobile để đỡ rối */}
						<p className='text-sm text-gray-500 font-medium hidden sm:block'>
							Quản lý tài chính cá nhân
						</p>
					</div>
				</header>

				{/* MAIN: Căn chỉnh lại padding, giới hạn độ rộng max-w-5xl để mắt người dùng tập trung hơn */}
				<main className='min-h-[calc(100vh-130px)]'>
					<div className='max-w-5xl mx-auto px-4 sm:px-6 py-8'>
						{children}
					</div>
				</main>

				{/* FOOTER: Tối giản, border trên mảnh */}
				<footer className='bg-white border-t border-gray-200 py-6 text-center'>
					<small className='text-xs font-medium text-gray-400 uppercase tracking-wider'>
						&copy; {new Date().getFullYear()} Sổ Thu Chi
					</small>
				</footer>
			</body>
		</html>
	);
					}
