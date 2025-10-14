"use client"

import { useEffect, useState } from 'react'

type ContainerDetails = {
	id: string
	name: string
	image: string
	state: {
		Status: string
		Running: boolean
		Paused: boolean
		Restarting: boolean
		OOMKilled: boolean
		Dead: boolean
		Pid: number
		ExitCode: number
		Error: string
		StartedAt: string
		FinishedAt: string
	}
	created: string
	env: string[]
	cmd: string[]
	workingDir: string
	user: string
	networkMode: string
	ports: Record<string, any>
	ipAddress: string
	gateway: string
	mounts: Array<{
		type: string
		source: string
		destination: string
		mode: string
		rw: boolean
		propagation: string
	}>
	memory: number
	cpuShares: number
	cpuQuota: number
	cpuPeriod: number
	labels: Record<string, string>
	concordService: string | null
	concordVersion: string | null
	concordBuild: string | null
	restartCount: number
	startedAt: string | null
	finishedAt: string | null
	logs: string
	stats: any
}

type ContainerDetailsModalProps = {
	isOpen: boolean
	onClose: () => void
	containerId: string | null
}

export default function ContainerDetailsModal({ isOpen, onClose, containerId }: ContainerDetailsModalProps) {
	const [details, setDetails] = useState<ContainerDetails | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'mounts' | 'network'>('overview')

	useEffect(() => {
		if (isOpen && containerId) {
			loadContainerDetails()
		}
	}, [isOpen, containerId])

	async function loadContainerDetails() {
		if (!containerId) return
		
		setLoading(true)
		setError(null)
		try {
			const res = await fetch(`/api/docker/containers/${containerId}/inspect`)
			if (!res.ok) {
				const data = await res.json()
				throw new Error(data.message || 'Failed to load container details')
			}
			const data = await res.json()
			setDetails(data)
		} catch (e: any) {
			setError(e?.message ?? 'Failed to load container details')
		} finally {
			setLoading(false)
		}
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto">
			<div className="flex min-h-screen items-center justify-center p-4">
				<div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
				<div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
					{/* Header */}
					<div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
							Container Details
						</h3>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					{/* Content */}
					<div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
						{loading && (
							<div className="flex items-center justify-center py-8">
								<div className="text-gray-600 dark:text-gray-400">Loading container details...</div>
							</div>
						)}

						{error && (
							<div className="text-red-600 dark:text-red-400 py-4">
								{error}
							</div>
						)}

						{details && (
							<>
								{/* Tabs */}
								<div className="flex space-x-1 mb-6 border-b border-gray-200 dark:border-gray-700">
									{['overview', 'logs', 'mounts', 'network'].map((tab) => (
										<button
											key={tab}
											onClick={() => setActiveTab(tab as any)}
											className={`px-4 py-2 text-sm font-medium capitalize ${
												activeTab === tab
													? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
													: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
											}`}
										>
											{tab}
										</button>
									))}
								</div>

								{/* Tab Content */}
								{activeTab === 'overview' && (
									<div className="space-y-6">
										{/* Basic Info */}
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Basic Information</h4>
												<div className="space-y-2 text-sm">
													<div className="flex justify-between">
														<span className="text-gray-500 dark:text-gray-400">Name:</span>
														<span className="font-mono">{details.name}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-500 dark:text-gray-400">Image:</span>
														<span className="font-mono">{details.image}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-500 dark:text-gray-400">Status:</span>
														<span className={`px-2 py-1 rounded text-xs ${
															details.state.Running 
																? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
																: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
														}`}>
															{details.state.Status}
														</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-500 dark:text-gray-400">Created:</span>
														<span>{new Date(details.created).toLocaleString()}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-500 dark:text-gray-400">Restart Count:</span>
														<span>{details.restartCount}</span>
													</div>
												</div>
											</div>

											<div>
												<h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Concord Labels</h4>
												<div className="space-y-2 text-sm">
													<div className="flex justify-between">
														<span className="text-gray-500 dark:text-gray-400">Service:</span>
														<span className="font-mono">{details.concordService || 'N/A'}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-500 dark:text-gray-400">Version:</span>
														<span className="font-mono">{details.concordVersion || 'N/A'}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-500 dark:text-gray-400">Build:</span>
														<span className="font-mono">{details.concordBuild || 'N/A'}</span>
													</div>
												</div>
											</div>
										</div>

										{/* Resources */}
										<div>
											<h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Resources</h4>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
												<div className="flex justify-between">
													<span className="text-gray-500 dark:text-gray-400">Memory Limit:</span>
													<span>{details.memory ? `${Math.round(details.memory / 1024 / 1024)}MB` : 'Unlimited'}</span>
												</div>
												<div className="flex justify-between">
													<span className="text-gray-500 dark:text-gray-400">CPU Shares:</span>
													<span>{details.cpuShares || 'Default'}</span>
												</div>
												<div className="flex justify-between">
													<span className="text-gray-500 dark:text-gray-400">Working Directory:</span>
													<span className="font-mono">{details.workingDir}</span>
												</div>
												<div className="flex justify-between">
													<span className="text-gray-500 dark:text-gray-400">User:</span>
													<span className="font-mono">{details.user || 'root'}</span>
												</div>
											</div>
										</div>

										{/* Environment Variables */}
										{details.env.length > 0 && (
											<div>
												<h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Environment Variables</h4>
												<div className="bg-gray-50 dark:bg-gray-700 rounded p-3 max-h-32 overflow-y-auto">
													{details.env.map((env, index) => (
														<div key={index} className="text-xs font-mono text-gray-700 dark:text-gray-300">
															{env}
														</div>
													))}
												</div>
											</div>
										)}
									</div>
								)}

								{activeTab === 'logs' && (
									<div>
										<h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Container Logs</h4>
										<div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs max-h-96 overflow-y-auto">
											<pre>{details.logs || 'No logs available'}</pre>
										</div>
									</div>
								)}

								{activeTab === 'mounts' && (
									<div>
										<h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Mounts</h4>
										{details.mounts.length > 0 ? (
											<div className="space-y-3">
												{details.mounts.map((mount, index) => (
													<div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-3">
														<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
															<div>
																<span className="text-gray-500 dark:text-gray-400">Type:</span>
																<span className="ml-2 font-mono">{mount.type}</span>
															</div>
															<div>
																<span className="text-gray-500 dark:text-gray-400">Mode:</span>
																<span className="ml-2">{mount.mode}</span>
															</div>
															<div className="md:col-span-2">
																<span className="text-gray-500 dark:text-gray-400">Source:</span>
																<span className="ml-2 font-mono text-xs">{mount.source}</span>
															</div>
															<div className="md:col-span-2">
																<span className="text-gray-500 dark:text-gray-400">Destination:</span>
																<span className="ml-2 font-mono text-xs">{mount.destination}</span>
															</div>
														</div>
													</div>
												))}
											</div>
										) : (
											<div className="text-gray-500 dark:text-gray-400">No mounts configured</div>
										)}
									</div>
								)}

								{activeTab === 'network' && (
									<div>
										<h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Network Configuration</h4>
										<div className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
												<div className="flex justify-between">
													<span className="text-gray-500 dark:text-gray-400">Network Mode:</span>
													<span className="font-mono">{details.networkMode}</span>
												</div>
												<div className="flex justify-between">
													<span className="text-gray-500 dark:text-gray-400">IP Address:</span>
													<span className="font-mono">{details.ipAddress || 'N/A'}</span>
												</div>
												<div className="flex justify-between">
													<span className="text-gray-500 dark:text-gray-400">Gateway:</span>
													<span className="font-mono">{details.gateway || 'N/A'}</span>
												</div>
											</div>

											{Object.keys(details.ports).length > 0 && (
												<div>
													<h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Port Mappings</h5>
													<div className="space-y-2">
														{Object.entries(details.ports).map(([containerPort, hostPorts]) => (
															<div key={containerPort} className="text-sm">
																<span className="font-mono">{containerPort}</span>
																<span className="text-gray-500 dark:text-gray-400"> → </span>
																<span className="font-mono">
																	{Array.isArray(hostPorts) 
																		? hostPorts.map((hp: any) => `${hp.HostIp}:${hp.HostPort}`).join(', ')
																		: 'N/A'
																	}
																</span>
															</div>
														))}
													</div>
												</div>
											)}
										</div>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
