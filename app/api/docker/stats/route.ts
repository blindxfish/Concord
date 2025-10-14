import { NextResponse } from 'next/server'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

export async function GET() {
	try {
		// Get Docker system information
		const { stdout: systemInfo } = await execAsync('docker system df --format "{{json .}}"')
		const systemData = systemInfo.trim().split('\n').map(line => {
			try {
				return JSON.parse(line)
			} catch {
				return null
			}
		}).filter(Boolean)

		// Get container statistics
		const { stdout: containersInfo } = await execAsync('docker ps -a --format "{{json .}}"')
		const containers = containersInfo.trim().split('\n').filter(Boolean).map(line => {
			try {
				return JSON.parse(line)
			} catch {
				return null
			}
		}).filter(Boolean)

		// Get image statistics
		const { stdout: imagesInfo } = await execAsync('docker images --format "{{json .}}"')
		const images = imagesInfo.trim().split('\n').filter(Boolean).map(line => {
			try {
				return JSON.parse(line)
			} catch {
				return null
			}
		}).filter(Boolean)

		// Get volume statistics
		const { stdout: volumesInfo } = await execAsync('docker volume ls --format "{{json .}}"')
		const volumes = volumesInfo.trim().split('\n').filter(Boolean).map(line => {
			try {
				return JSON.parse(line)
			} catch {
				return null
			}
		}).filter(Boolean)

		// Calculate statistics
		const runningContainers = containers.filter(c => c.State === 'running').length
		const stoppedContainers = containers.filter(c => c.State !== 'running').length
		const totalImages = images.length
		const totalVolumes = volumes.length

		// Get system resource usage
		let systemUsage = null
		try {
			const { stdout: statsInfo } = await execAsync('docker system df')
			const lines = statsInfo.trim().split('\n')
			const totalLine = lines.find(line => line.includes('TOTAL'))
			if (totalLine) {
				const parts = totalLine.split(/\s+/)
				systemUsage = {
					total: parts[1] || 'Unknown',
					active: parts[2] || 'Unknown',
					size: parts[3] || 'Unknown',
					reclaimable: parts[4] || 'Unknown'
				}
			}
		} catch (e) {
			// Ignore if we can't get system usage
		}

		// Get Concord-specific containers
		const concordContainers = containers.filter(c => 
			c.Names && c.Names.includes('concord-web')
		)

		// Get recent activity (containers created in last 24 hours)
		const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
		const recentContainers = containers.filter(c => {
			const created = new Date(c.CreatedAt)
			return created > oneDayAgo
		}).length

		const stats = {
			containers: {
				total: containers.length,
				running: runningContainers,
				stopped: stoppedContainers,
				recent: recentContainers
			},
			images: {
				total: totalImages
			},
			volumes: {
				total: totalVolumes
			},
			concord: {
				containers: concordContainers.length,
				versions: concordContainers.map(c => {
					const name = c.Names || ''
					const versionMatch = name.match(/concord-web-([^-]+)-/)
					return versionMatch ? versionMatch[1] : 'unknown'
				}).filter(v => v !== 'unknown')
			},
			system: systemUsage,
			lastUpdated: new Date().toISOString()
		}

		return NextResponse.json(stats)
	} catch (error: any) {
		console.error('Error fetching Docker stats:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch system statistics' },
			{ status: 500 }
		)
	}
}
