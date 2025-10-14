"use client"

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

export default function Navigation() {
	const pathname = usePathname()
	
	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/images', label: 'Docker Images' },
		{ href: '/services', label: 'Containers' },
		{ href: '/guide', label: 'Naming Guide' },
	]

	return (
		<header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
			<div className="mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-8">
						<Link href="/" className="flex items-center space-x-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
							<Image
								src="/graphics/simplelogolight.png"
								alt="Concord Logo"
								width={32}
								height={32}
								className="hidden dark:block"
							/>
							<Image
								src="/graphics/simplelogodark.png"
								alt="Concord Logo"
								width={32}
								height={32}
								className="block dark:hidden"
							/>
							<span>Concord</span>
						</Link>
						<nav className="hidden md:flex space-x-6">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className={`text-sm font-medium transition-colors ${
										pathname === item.href
											? 'text-blue-600 dark:text-blue-400'
											: 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
									}`}
								>
									{item.label}
								</Link>
							))}
						</nav>
					</div>
					<ThemeToggle />
				</div>
				
				{/* Mobile navigation */}
				<div className="md:hidden mt-4">
					<nav className="flex flex-wrap gap-4">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`text-sm font-medium transition-colors ${
									pathname === item.href
										? 'text-blue-600 dark:text-blue-400'
										: 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
								}`}
							>
								{item.label}
							</Link>
						))}
					</nav>
				</div>
			</div>
		</header>
	)
}
