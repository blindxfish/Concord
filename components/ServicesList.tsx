"use client"

import { useEffect, useState } from 'react'
import ContainerDetailsModal from './ContainerDetailsModal'

type Container = {
	id: string
	name: string
	image: string
	imageId: string
	status: string
	state: string
	created: string
	ports: string
	labels: Record<string, string>
	volumes: string[]
	command: string
	// Concord-specific labels for proper service organization
	concordService?: string | null
	concordVersion?: string | null
	concordBuild?: string | null
}

type Image = {
	id: string
	repository: string
	tag: string
	size: string
	created: string
}

type ServiceGroup = {
	serviceName: string
	versions: Array<{
		container?: Container
		image: Image
		isRunning: boolean
		hasContainer: boolean
	}>
}

export default function ServicesList() {
	const [services, setServices] = useState<ServiceGroup[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'stopped'>('all')
	const [selectedContainerId, setSelectedContainerId] = useState<string | null>(null)
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

	async function loadData() {
		setLoading(true)
		setError(null)
		try {
			const res = await fetch('/api/docker/containers', { cache: 'no-store' })
			if (!res.ok) {
				const data = await res.json()
				throw new Error(data.message || 'Failed to load containers')
			}
			const data = await res.json()
			
			// Group containers and images by service name
			const serviceMap = new Map<string, ServiceGroup>()
			
			// Process containers - use concord labels for proper service grouping
			data.containers.forEach((container: Container) => {
				// Use concord.service label if available, fallback to name parsing
				const serviceName = container.concordService || extractServiceName(container.name)
				if (!serviceMap.has(serviceName)) {
					serviceMap.set(serviceName, {
						serviceName,
						versions: []
					})
				}
				
				// Find matching image - prioritize exact imageId match
				const matchingImage = data.images.find((img: Image) => 
					img.id === container.imageId
				) || data.images.find((img: Image) => 
					container.image === `${img.repository}:${img.tag}`
				)
				
				// Always add the container, even if no matching image is found
				// Create a placeholder image if none exists
				const image = matchingImage || {
					id: container.imageId,
					repository: container.image.split(':')[0] || '<none>',
					tag: container.image.split(':')[1] || '<none>',
					size: 'Unknown',
					created: 'Unknown'
				}
				
				serviceMap.get(serviceName)!.versions.push({
					container,
					image,
					isRunning: container.state === 'running',
					hasContainer: true
				})
			})
			
			// Note: In your workflow, every image should have a container
			// This section is kept for edge cases but shouldn't be needed
			// Note: We only process containers now, not standalone images
			// Images without containers are managed separately in the Images page
			
			// Sort versions by version (newest first) - use concord labels when available
			serviceMap.forEach(service => {
            service.versions.sort((a, b) => {
                // Primary: semantic version desc - use concord.version if available
                const aVersion = a.container?.concordVersion || 
                    (a.container ? extractVersionFromContainer(a.container.name) : a.image.tag)
                const bVersion = b.container?.concordVersion || 
                    (b.container ? extractVersionFromContainer(b.container.name) : b.image.tag)
                const aVersionNum = extractVersion(aVersion)
                const bVersionNum = extractVersion(bVersion)
                const cmp = bVersionNum.localeCompare(aVersionNum, undefined, { numeric: true })
                if (cmp !== 0) return cmp

                // Secondary: build timestamp desc if same version - use concord.build if available
                const aBuild = a.container?.concordBuild || 
                    (a.container ? (extractBuildFromContainer(a.container.name) ?? '0') : '0')
                const bBuild = b.container?.concordBuild || 
                    (b.container ? (extractBuildFromContainer(b.container.name) ?? '0') : '0')
                return Number(bBuild) - Number(aBuild)
            })
			})
			
			setServices(Array.from(serviceMap.values()))
		} catch (e: any) {
			setError(e?.message ?? 'Failed to load services')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadData()
	}, [])

	async function stopContainer(containerId: string) {
		try {
			const res = await fetch(`/api/docker/containers/${containerId}/stop`, {
				method: 'POST'
			})
			if (!res.ok) throw new Error('Failed to stop container')
			await loadData() // Refresh data
		} catch (e: any) {
			alert(`Failed to stop container: ${e.message}`)
		}
	}

	async function startVersion(containerId: string, serviceName: string) {
		try {
			// Stop all running containers for this service first
			const runningContainers = services
				.find(s => s.serviceName === serviceName)
				?.versions.filter(v => v.isRunning) || []
			
			for (const version of runningContainers) {
				if (version.container) {
					await fetch(`/api/docker/containers/${version.container.id}/stop`, { method: 'POST' })
				}
			}
			
			// Start the selected container
			await fetch(`/api/docker/containers/${containerId}/start`, { method: 'POST' })
			await loadData() // Refresh data
		} catch (e: any) {
			alert(`Failed to start version: ${e.message}`)
		}
	}

	async function deleteContainer(containerId: string, containerName?: string) {
		const containerInfo = containerName ? ` "${containerName}"` : ` (ID: ${containerId})`
		if (!confirm(`Are you sure you want to delete container${containerInfo}? This action cannot be undone.`)) {
			return
		}
		
		try {
			const res = await fetch(`/api/docker/containers/${containerId}/delete`, {
				method: 'DELETE'
			})
			if (!res.ok) throw new Error('Failed to delete container')
			await loadData() // Refresh data
		} catch (e: any) {
			alert(`Failed to delete container: ${e.message}`)
		}
	}

	function openDetailsModal(containerId: string) {
		setSelectedContainerId(containerId)
		setIsDetailsModalOpen(true)
	}

	function closeDetailsModal() {
		setIsDetailsModalOpen(false)
		setSelectedContainerId(null)
	}

	// Filter services based on search and status
	const filteredServices = services.filter(service => {
		// Filter by search query
		if (searchQuery && !service.serviceName.toLowerCase().includes(searchQuery.toLowerCase())) {
			return false
		}
		
		// Filter by status
		if (statusFilter !== 'all') {
			const hasMatchingStatus = service.versions.some(version => 
				statusFilter === 'running' ? version.isRunning : !version.isRunning
			)
			if (!hasMatchingStatus) return false
		}
		
		return true
	})

	if (loading) {
		return <div className="p-6 text-sm text-gray-600 dark:text-gray-400">Loading services…</div>
	}

	if (error) {
		return (
			<div className="p-6 text-sm text-red-600 dark:text-red-400">
				{error}
				<div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
					Tips: ensure Docker is running and accessible.
				</div>
			</div>
		)
	}

	return (
		<div className="p-6 w-full">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-lg font-medium">Services</h2>
				<button
					onClick={loadData}
					className="inline-flex items-center rounded-md bg-blue-600 dark:bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600"
				>
					Refresh
				</button>
			</div>
			
			{/* Search and Filter Controls */}
			<div className="mb-6 flex gap-4 items-center">
				<input
					type="text"
					placeholder="Search services..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="flex-1 max-w-md rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500 dark:focus:ring-blue-400"
				/>
				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value as 'all' | 'running' | 'stopped')}
					className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500 dark:focus:ring-blue-400"
				>
					<option value="all">All Status</option>
					<option value="running">Running Only</option>
					<option value="stopped">Stopped Only</option>
				</select>
			</div>
			
			{filteredServices.length === 0 ? (
				<div className="text-center text-gray-500 dark:text-gray-400 py-8">No services found</div>
			) : (
				<div className="space-y-6">
					{filteredServices.map(service => (
						<div key={service.serviceName} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
							<h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
								{service.serviceName}
							</h3>
							<div className="space-y-2">
								{/* Header row */}
								<div className="grid grid-cols-12 gap-4 items-center px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-700 rounded">
									<div className="col-span-3">Version</div>
									<div className="col-span-1">Status</div>
									<div className="col-span-2">Image ID</div>
									<div className="col-span-1">Size</div>
									<div className="col-span-2">Ports</div>
									<div className="col-span-1">Volumes</div>
									<div className="col-span-2">Actions</div>
								</div>
								{service.versions.map((version, index) => (
									<div key={`${version.image.id}-${index}`} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
										<div className="grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-3 font-medium flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    {/* Use concord.version if available, fallback to name parsing */}
                                                    {version.container?.concordVersion || 
                                                        (version.container ? extractVersionFromContainer(version.container.name) : version.image.tag)}
                                                    {/* Show build info from concord.build if available */}
                                                    {(version.container?.concordBuild || 
                                                        (version.container && extractBuildFromContainer(version.container.name))) && (
                                                        <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-100 text-[10px] rounded">
                                                            build {version.container?.concordBuild || extractBuildFromContainer(version.container.name)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 flex-wrap">
													{index === 0 && (
														<span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded z-10 relative">
															Latest
														</span>
													)}
													{version.image.size === 'Unknown' && (
														<span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded z-10 relative">
															No Image
														</span>
													)}
												</div>
											</div>
											<div className="col-span-1">
												<div className={`px-2 py-1 rounded text-xs font-medium w-fit ${
													version.isRunning 
														? 'bg-green-100 text-green-800' 
														: 'bg-gray-100 text-gray-600'
												}`}>
													{version.isRunning ? 'running' : (index === 1 ? 'Prev stopped' : 'stopped')}
												</div>
											</div>
                                            <div className="col-span-2 text-sm text-gray-600 dark:text-gray-400 font-mono">
                                                {version.image?.id || '—'}
                                            </div>
                                            <div className="col-span-1 text-sm text-gray-600 dark:text-gray-400">
                                                {version.image?.size || '—'}
                                            </div>
											<div className="col-span-2 text-sm text-gray-600 dark:text-gray-400 font-mono">
                                                {version.container?.ports ? 
													version.container.ports
													: 'no ports'}
											</div>
											<div className="col-span-1 text-sm text-gray-600 dark:text-gray-400">
                                                {version.container?.volumes && version.container.volumes.length > 0 ? `${version.container.volumes.length} volumes` : 'no volumes'}
											</div>
											<div className="col-span-2 flex gap-2 flex-wrap">
												{version.isRunning ? (
													<button
														onClick={() => stopContainer(version.container!.id)}
														className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
													>
														Stop
													</button>
												) : (
													<button
														onClick={() => startVersion(version.container!.id, service.serviceName)}
														className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
													>
														Start
													</button>
												)}
												{/* Details button for all containers */}
												<button
													onClick={() => openDetailsModal(version.container!.id)}
													className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
												>
													Details
												</button>
												{/* Add delete button for stopped containers */}
												{!version.isRunning && (
													<button
														onClick={() => deleteContainer(version.container!.id, version.container!.name)}
														className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
													>
														Delete
													</button>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			)}
			
			{/* Container Details Modal */}
			<ContainerDetailsModal
				isOpen={isDetailsModalOpen}
				onClose={closeDetailsModal}
				containerId={selectedContainerId}
			/>
		</div>
	)
}

function extractServiceName(name: string): string {
    // Prefer parsing container names like: service-name-vX.Y.Z or service-name-X.Y.Z[-BUILD]
    const match = name.match(/^(.+?)-(v?\d+\.\d+\.\d+)(?:-(\d+))?$/)
    if (match) {
        return match[1]
    }

    // Fallback to previous generic behavior
    const base = name.split(':')[0].split('/').pop() || name
    return base
}

function extractVersionFromContainer(name: string): string {
    // Expected: service-name-vX.Y.Z or service-name-X.Y.Z[-BUILD]
    const match = name.match(/^.+?-(v?\d+\.\d+\.\d+)(?:-\d+)?$/)
    if (match) {
        const v = match[1]
        return v.startsWith('v') ? v : `v${v}`
    }
    return 'latest'
}

function extractBuildFromContainer(name: string): string | null {
    const match = name.match(/^.+?-(v?\d+\.\d+\.\d+)-(\d+)$/)
    return match ? match[2] : null
}

function extractVersion(tag: string): string {
	// Extract version for sorting (e.g., v1.1.1 -> 1.1.1)
	return tag.replace(/^v/, '').replace(/[^\d.]/g, '')
}
