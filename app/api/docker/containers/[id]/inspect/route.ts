import { NextResponse } from 'next/server'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const containerId = params.id

	try {
		// Get detailed container information
		const { stdout: inspectOutput } = await execAsync(`docker inspect ${containerId}`)
		const inspect = JSON.parse(inspectOutput)[0]

		// Get container logs (last 100 lines)
		let logs = ''
		try {
			const { stdout: logsOutput } = await execAsync(`docker logs --tail 100 ${containerId}`)
			logs = logsOutput
		} catch (error) {
			logs = 'Unable to retrieve logs'
		}

		// Get container stats
		let stats = null
		try {
			const { stdout: statsOutput } = await execAsync(`docker stats --no-stream --format "{{json .}}" ${containerId}`)
			stats = JSON.parse(statsOutput)
		} catch (error) {
			// Stats might not be available for stopped containers
		}

		// Extract relevant information
		const containerDetails = {
			// Basic info
			id: inspect.Id,
			name: inspect.Name?.replace('/', '') || 'unnamed',
			image: inspect.Config?.Image || 'unknown',
			state: inspect.State,
			created: inspect.Created,
			
			// Configuration
			env: inspect.Config?.Env || [],
			cmd: inspect.Config?.Cmd || [],
			workingDir: inspect.Config?.WorkingDir || '',
			user: inspect.Config?.User || '',
			
			// Network
			networkMode: inspect.HostConfig?.NetworkMode || 'default',
			ports: inspect.NetworkSettings?.Ports || {},
			ipAddress: inspect.NetworkSettings?.IPAddress || '',
			gateway: inspect.NetworkSettings?.Gateway || '',
			
			// Storage
			mounts: inspect.Mounts?.map((mount: any) => ({
				type: mount.Type,
				source: mount.Source,
				destination: mount.Destination,
				mode: mount.Mode,
				rw: mount.RW,
				propagation: mount.Propagation
			})) || [],
			
			// Resources
			memory: inspect.HostConfig?.Memory || 0,
			cpuShares: inspect.HostConfig?.CpuShares || 0,
			cpuQuota: inspect.HostConfig?.CpuQuota || 0,
			cpuPeriod: inspect.HostConfig?.CpuPeriod || 0,
			
			// Labels
			labels: inspect.Config?.Labels || {},
			
			// Concord-specific labels
			concordService: inspect.Config?.Labels?.['concord.service'] || null,
			concordVersion: inspect.Config?.Labels?.['concord.version'] || null,
			concordBuild: inspect.Config?.Labels?.['concord.build'] || null,
			
			// Runtime info
			restartCount: inspect.RestartCount || 0,
			startedAt: inspect.State?.StartedAt || null,
			finishedAt: inspect.State?.FinishedAt || null,
			
			// Logs and stats
			logs: logs,
			stats: stats
		}

		return NextResponse.json(containerDetails)
	} catch (error: any) {
		const rawMessage = typeof error?.stderr === 'string' && error.stderr.trim().length > 0
			? error.stderr
			: (typeof error?.message === 'string' ? error.message : 'Failed to inspect container')

		const message = String(rawMessage)
		const lower = message.toLowerCase()

		if (lower.includes('no such container')) {
			return NextResponse.json({
				error: 'Container not found',
				message: `Container with ID ${containerId} does not exist`
			}, { status: 404 })
		}

		if (lower.includes('permission denied') && lower.includes('/var/run/docker.sock')) {
			return NextResponse.json({
				errorCode: 'DOCKER_PERMISSION_DENIED',
				message: 'Permission denied accessing Docker daemon socket.',
				suggestions: [
					"Ensure your user is in the 'docker' group",
					"Log out and back in (or run 'newgrp docker') to apply group changes",
					"Alternatively run the server with sufficient privileges (not recommended)"
				],
				stderr: message,
			}, { status: 403 })
		}

		return NextResponse.json({ 
			error: 'Failed to inspect container', 
			stderr: message 
		}, { status: 500 })
	}
}
