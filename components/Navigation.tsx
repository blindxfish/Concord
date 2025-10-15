"use client"

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

export default function Navigation() {
    const pathname = usePathname()
    const router = useRouter()
    async function logout() {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
    }
	
	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/images', label: 'Docker Images' },
		{ href: '/services', label: 'Containers' },
		{ href: '/guide', label: 'Documentation' },
		{ href: '/users', label: 'Users' },
		{ href: '/about', label: 'About' },
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
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    {pathname !== '/login' && (
                        <button onClick={logout} className="px-3 py-1.5 rounded text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100">
                            Logout
                        </button>
                    )}
                </div>
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
