"use client"

import { useState, useEffect } from 'react'

interface SystemStats {
	containers: {
		total: number
		running: number
		stopped: number
		recent: number
	}
	images: {
		total: number
	}
	volumes: {
		total: number
	}
	concord: {
		containers: number
		versions: string[]
	}
	system: {
		total: string
		active: string
		size: string
		reclaimable: string
	} | null
	lastUpdated: string
}

export default function Dashboard() {
	const [stats, setStats] = useState<SystemStats | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		loadStats()
		const interval = setInterval(loadStats, 30000) // Refresh every 30 seconds
		return () => clearInterval(interval)
	}, [])

	async function loadStats() {
		try {
			const response = await fetch('/api/docker/stats', { cache: 'no-store' })
			if (!response.ok) {
				throw new Error('Failed to load stats')
			}
			const data = await response.json()
			setStats(data)
			setError(null)
		} catch (e: any) {
			setError(e.message)
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
				<p className="text-red-800 dark:text-red-200">Error loading dashboard: {error}</p>
			</div>
		)
	}

	if (!stats) return null

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">System Dashboard</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-1">
						Last updated: {new Date(stats.lastUpdated).toLocaleTimeString()}
					</p>
				</div>
				<button
					onClick={loadStats}
					className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					Refresh
				</button>
			</div>

			{/* Main Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{/* Containers Card */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Containers</p>
							<p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.containers.total}</p>
						</div>
						<div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
							<svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
							</svg>
						</div>
					</div>
					<div className="mt-4 flex space-x-4 text-sm">
						<div className="flex items-center">
							<div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
							<span className="text-gray-600 dark:text-gray-400">{stats.containers.running} running</span>
						</div>
						<div className="flex items-center">
							<div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
							<span className="text-gray-600 dark:text-gray-400">{stats.containers.stopped} stopped</span>
						</div>
					</div>
				</div>

				{/* Images Card */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Images</p>
							<p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.images.total}</p>
						</div>
						<div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
							<svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
						</div>
					</div>
					<div className="mt-4">
						<p className="text-sm text-gray-600 dark:text-gray-400">Docker images available</p>
					</div>
				</div>

				{/* Volumes Card */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Volumes</p>
							<p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.volumes.total}</p>
						</div>
						<div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
							<svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
							</svg>
						</div>
					</div>
					<div className="mt-4">
						<p className="text-sm text-gray-600 dark:text-gray-400">Persistent storage volumes</p>
					</div>
				</div>

				{/* Recent Activity Card */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Activity</p>
							<p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.containers.recent}</p>
						</div>
						<div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
							<svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
					</div>
					<div className="mt-4">
						<p className="text-sm text-gray-600 dark:text-gray-400">Containers created in last 24h</p>
					</div>
				</div>
			</div>

			{/* Concord Status Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Concord Versions */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Concord Versions</h3>
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-600 dark:text-gray-400">Active Versions</span>
							<span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{stats.concord.containers}</span>
						</div>
						{stats.concord.versions.length > 0 && (
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Available Versions:</p>
								<div className="flex flex-wrap gap-2">
									{stats.concord.versions.map((version, index) => (
										<span
											key={index}
											className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs rounded-full"
										>
											v{version}
										</span>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				{/* System Usage */}
				{stats.system && (
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">System Usage</h3>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600 dark:text-gray-400">Total Space</span>
								<span className="text-sm font-medium text-gray-900 dark:text-gray-100">{stats.system.total}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
								<span className="text-sm font-medium text-gray-900 dark:text-gray-100">{stats.system.active}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600 dark:text-gray-400">Size</span>
								<span className="text-sm font-medium text-gray-900 dark:text-gray-100">{stats.system.size}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600 dark:text-gray-400">Reclaimable</span>
								<span className="text-sm font-medium text-green-600 dark:text-green-400">{stats.system.reclaimable}</span>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Quick Actions */}
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
				<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<a
						href="/services"
						className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
					>
						<svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
						</svg>
						<div>
							<p className="font-medium text-blue-900 dark:text-blue-100">Manage Containers</p>
							<p className="text-sm text-blue-600 dark:text-blue-400">Start, stop, and manage containers</p>
						</div>
					</a>
					<a
						href="/images"
						className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
					>
						<svg className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
						<div>
							<p className="font-medium text-purple-900 dark:text-purple-100">Docker Images</p>
							<p className="text-sm text-purple-600 dark:text-purple-400">View and manage images</p>
						</div>
					</a>
					<a
						href="/guide"
						className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
					>
						<svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						<div>
							<p className="font-medium text-green-900 dark:text-green-100">Documentation</p>
							<p className="text-sm text-green-600 dark:text-green-400">Learn about Concord labels</p>
						</div>
					</a>
				</div>
			</div>
		</div>
	)
}
