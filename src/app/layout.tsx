import './globals.css';
import { NotebookPen } from 'lucide-react';
import { metadata } from './root-metadata';

export { metadata };

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='vi'>
			<head />
			<body className='bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 font-sans min-h-screen'>
				<header className='bg-white/80 backdrop-blur-sm border-b border-slate-200/50 py-6 shadow-sm'>
					<div className='max-w-6xl mx-auto px-6 flex flex-col items-center gap-3'>
						<div className='flex items-center gap-3'>
							<NotebookPen className='w-8 h-8 text-blue-600' />
							<h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
								Sổ Thu Chi
							</h1>
						</div>
						<p className='text-slate-600 mt-1 px-6'>Ghi chép chi tiêu hàng ngày của bạn</p>
					</div>
				</header>
				<main className='min-h-[calc(100vh-140px)] py-10'>
					<div className='max-w-6xl mx-auto px-0 md:px-4'>{children}</div>
				</main>
				<footer className='bg-white/80 backdrop-blur-sm border-t border-slate-200/50 py-6 text-center'>
					<small className='text-slate-500'>
						&copy; {new Date().getFullYear()} Sổ Thu Chi - Ghi chép chi tiêu đơn giản
					</small>
				</footer>
			</body>
		</html>
	);
}
