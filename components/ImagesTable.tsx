"use client"

import { useEffect, useMemo, useState } from 'react'

type DockerImage = {
	repository: string
	tag: string
	id: string
	size: string
	createdSince: string
	isRunning?: boolean
}

type DockerVolume = {
	name: string
	driver: string
	created: string
	mountpoint: string
	labels: Record<string, string>
	size: string
}

export default function ImagesTableClient() {
	const [images, setImages] = useState<DockerImage[] | null>(null)
	const [volumes, setVolumes] = useState<DockerVolume[] | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [query, setQuery] = useState<string>("")
	const [selectedVolumes, setSelectedVolumes] = useState<Record<string, string>>({})

	async function loadImages() {
		setIsLoading(true)
		setError(null)
		try {
			const res = await fetch('/api/docker/images', { cache: 'no-store' })
			if (!res.ok) {
				// Try to parse structured error from API
				let msg = 'Failed to load images'
				try {
					const data = await res.json()
					if (data?.message) msg = data.message
					if (res.status === 403 && data?.errorCode === 'DOCKER_PERMISSION_DENIED') {
						msg = `${data.message}. Ensure your user is in the 'docker' group and relogin.`
					}
					if (res.status === 503 && data?.errorCode === 'DOCKER_DAEMON_UNAVAILABLE') {
						msg = `${data.message}. Start Docker service and try again.`
					}
				} catch {
					// ignore parse failure
				}
				throw new Error(msg)
			}
			const data = (await res.json()) as DockerImage[]
			setImages(data)
		} catch (e: any) {
			setError(e?.message ?? 'Failed to load images')
		} finally {
			setIsLoading(false)
		}
	}

	async function loadVolumes() {
		try {
			const res = await fetch('/api/docker/volumes', { cache: 'no-store' })
			if (!res.ok) {
				throw new Error('Failed to load volumes')
			}
			const data = (await res.json()) as DockerVolume[]
			setVolumes(data)
		} catch (e: any) {
			console.error('Failed to load volumes:', e)
			// Don't set error state for volumes, just log it
		}
	}

	useEffect(() => {
		let cancelled = false
		;(async () => {
			try {
				setIsLoading(true)
				const res = await fetch('/api/docker/images', { cache: 'no-store' })
				if (!res.ok) throw new Error(await res.text())
				const data = (await res.json()) as DockerImage[]
				if (!cancelled) setImages(data)
			} catch (e: any) {
				if (!cancelled) setError(e?.message ?? 'Failed to load images')
			} finally {
				if (!cancelled) setIsLoading(false)
			}
		})()
		
		// Load volumes in parallel
		loadVolumes()
		
		return () => {
			cancelled = true
		}
	}, [])

	// Set default volume selection when both images and volumes are loaded
	useEffect(() => {
		if (images && volumes && volumes.length > 0) {
			const defaultVolume = volumes[0].name
			setSelectedVolumes(prev => {
				const newSelections = { ...prev }
				// Set default volume for all images that don't have a selection yet
				images.forEach(img => {
					const imageKey = `${img.repository}:${img.tag}`
					if (!newSelections[imageKey]) {
						newSelections[imageKey] = defaultVolume
					}
				})
				return newSelections
			})
		}
	}, [images, volumes])

	// Group images by repository and check running status
	const groupedImages = useMemo(() => {
		if (!images) return []
		
		const groups = new Map<string, DockerImage[]>()
		images.forEach(img => {
			const repo = img.repository === '<none>' ? 'untagged' : img.repository
			if (!groups.has(repo)) {
				groups.set(repo, [])
			}
			groups.get(repo)!.push(img)
		})
		
		// Sort images within each group by tag (newest first)
		groups.forEach(group => {
			group.sort((a, b) => {
				const aVersion = extractVersion(a.tag)
				const bVersion = extractVersion(b.tag)
				return bVersion.localeCompare(aVersion, undefined, { numeric: true })
			})
		})
		
		return Array.from(groups.entries()).map(([repository, images]) => ({
			repository,
			images
		}))
	}, [images])

	const filtered = useMemo(() => {
		if (!groupedImages) return []
		const q = query.trim().toLowerCase()
		if (!q) return groupedImages
		return groupedImages.filter(group =>
			group.repository.toLowerCase().includes(q) ||
			group.images.some(img => 
				`${img.repository}:${img.tag} ${img.id}`.toLowerCase().includes(q)
			)
		)
	}, [groupedImages, query])

	async function createContainerFromImage(image: DockerImage) {
		try {
			const imageKey = `${image.repository}:${image.tag}`
			const selectedVolume = selectedVolumes[imageKey] || ''
			
			const res = await fetch('/api/docker/containers/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					image: imageKey,
					name: `${extractServiceName(image.repository)}-${Date.now()}`,
					serviceName: extractServiceName(image.repository),
					volume: selectedVolume || undefined,
					port: 3000 + Math.floor(Math.random() * 1000) // Random port to avoid conflicts
				})
			})
			if (!res.ok) throw new Error('Failed to create container')
			await loadImages() // Refresh data
		} catch (e: any) {
			alert(`Failed to create container: ${e.message}`)
		}
	}

	async function deleteImage(image: DockerImage) {
		if (!confirm(`Are you sure you want to delete image ${image.repository}:${image.tag}?`)) {
			return
		}
		
		try {
			const res = await fetch(`/api/docker/images/${image.id}/delete`, {
				method: 'DELETE'
			})
			
			if (!res.ok) {
				const error = await res.json()
				throw new Error(error.error || 'Failed to delete image')
			}
			
			await loadImages() // Refresh data
		} catch (e: any) {
			alert(`Failed to delete image: ${e.message}`)
		}
	}

	async function cleanupUntaggedImages() {
		if (!confirm('Are you sure you want to delete all untagged images? This action cannot be undone.')) {
			return
		}
		
		try {
			const res = await fetch('/api/docker/images/cleanup', {
				method: 'POST'
			})
			
			const result = await res.json()
			
			if (!res.ok) {
				throw new Error(result.error || 'Failed to clean up images')
			}
			
			alert(result.message)
			await loadImages() // Refresh data
		} catch (e: any) {
			alert(`Failed to clean up images: ${e.message}`)
		}
	}

	function extractServiceName(repository: string): string {
		// Extract service name from repository
		if (repository === '<none>') return 'untagged'
		return repository.split('/').pop() || repository
	}

	function extractVersion(tag: string): string {
		// Extract version for sorting (e.g., v1.1.1 -> 1.1.1)
		return tag.replace(/^v/, '').replace(/[^\d.]/g, '')
	}

	if (error) {
			return (
				<div className="p-6 text-sm text-red-600 dark:text-red-400">
					{error}
					<div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
						Tips: add your user to the docker group and relogin (newgrp docker), or ensure the Docker daemon is running.
					</div>
				</div>
			)
	}
	if (!images) {
		return <div className="p-6 text-sm text-gray-600 dark:text-gray-400">Loading images…</div>
	}

	return (
		<div className="overflow-x-auto">
			<div className="flex items-center justify-between gap-3 p-4">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Filter by repo:tag or ID"
					className="w-full max-w-xs rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500 dark:focus:ring-blue-400"
				/>
				<div className="flex items-center space-x-2">
					<button
						onClick={cleanupUntaggedImages}
						className="inline-flex items-center rounded-md bg-orange-600 dark:bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-700 dark:hover:bg-orange-600"
					>
						Cleanup Untagged
					</button>
					<button
						onClick={loadImages}
						disabled={isLoading}
						className="inline-flex items-center rounded-md bg-blue-600 dark:bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isLoading ? 'Refreshing…' : 'Refresh'}
					</button>
				</div>
			</div>
			<div className="space-y-6">
				{filtered.map((group) => (
					<div key={group.repository} className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
						<div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
							<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
								{group.repository}
								<span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
									({group.images.length} version{group.images.length !== 1 ? 's' : ''})
								</span>
							</h3>
						</div>
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
								<thead className="bg-gray-50 dark:bg-gray-800">
									<tr>
										<th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Tag</th>
										<th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Image ID</th>
										<th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Size</th>
										<th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Created</th>
										<th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Volume</th>
										<th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
									{group.images.map((img, index) => (
										<tr key={`${img.repository}:${img.tag}:${img.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
											<td className="whitespace-nowrap px-4 py-3 text-sm">
												<div className="flex items-center gap-2">
													{img.tag}
													{index === 0 && (
														<span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
															Latest
														</span>
													)}
													{img.isRunning && (
														<span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded flex items-center gap-1">
															<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
															Running
														</span>
													)}
												</div>
											</td>
											<td className="whitespace-nowrap px-4 py-3 text-sm font-mono">{img.id}</td>
											<td className="whitespace-nowrap px-4 py-3 text-sm">{img.size}</td>
											<td className="whitespace-nowrap px-4 py-3 text-sm">{img.createdSince}</td>
											<td className="whitespace-nowrap px-4 py-3 text-sm">
												<select
													value={selectedVolumes[`${img.repository}:${img.tag}`] || ''}
													onChange={(e) => {
														const imageKey = `${img.repository}:${img.tag}`
														setSelectedVolumes(prev => ({
															...prev,
															[imageKey]: e.target.value
														}))
													}}
													className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
												>
													<option value="">No Volume</option>
													{volumes?.map(volume => (
														<option key={volume.name} value={volume.name}>
															{volume.name}
														</option>
													))}
												</select>
											</td>
											<td className="whitespace-nowrap px-4 py-3 text-sm">
												<div className="flex items-center gap-2">
													<button
														onClick={() => createContainerFromImage(img)}
														className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
													>
														Create Container
													</button>
													<button
														onClick={() => deleteImage(img)}
														className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
													>
														Delete
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}


