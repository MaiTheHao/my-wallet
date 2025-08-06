import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'My Wallet - Personal Expense Management with AI',
	description:
		'A simple web app for managing personal expenses, using AI to analyze and record transactions from natural language descriptions. Supports English and Vietnamese documentation.',
	keywords: [
		'expense management',
		'personal finance',
		'AI',
		'Google AI Studio',
		'Gemini',
		'MVP',
		'Vietnamese',
		'English',
		'Next.js',
		'MongoDB',
	],
	alternates: {
		canonical: '/',
		languages: {
			en: '/READMEs/eng.md',
			vi: '/READMEs/vn.md',
		},
	},
	openGraph: {
		title: 'My Wallet - Personal Expense Management with AI',
		description:
			'Manage your personal expenses easily with AI-powered analysis and natural language transaction recording. English and Vietnamese docs available.',
		url: 'https://your-app-url.com/',
		siteName: 'My Wallet',
		locale: 'en_US',
		type: 'website',
	},
	robots: {
		index: true,
		follow: true,
	},
};
