import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '../contexts/ThemeContext'
import Navigation from '../components/Navigation'

export const metadata: Metadata = {
	title: 'Concord',
	description: 'Docker image explorer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="h-full">
			<body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 antialiased transition-colors">
				<ThemeProvider>
					<Navigation />
					<main className="min-h-screen">
						{children}
					</main>
				</ThemeProvider>
			</body>
		</html>
	)
}


