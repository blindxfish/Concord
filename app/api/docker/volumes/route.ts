import { NextResponse } from 'next/server'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

export async function GET() {
	try {
		// Get all Docker volumes
		const { stdout: volumesOutput } = await execAsync('docker volume ls --format "{{json .}}"')
		const volumeLines = volumesOutput.split('\n').filter(Boolean)
		const volumes = volumeLines.map(line => {
			try {
				return JSON.parse(line)
			} catch {
				return null
			}
		}).filter(Boolean)

		// Get detailed information for each volume
		const volumeDetails = await Promise.all(
			volumes.map(async (volume) => {
				try {
					const { stdout: inspectOutput } = await execAsync(`docker volume inspect ${volume.Name}`)
					const inspect = JSON.parse(inspectOutput)[0]
					
					return {
						name: volume.Name,
						driver: volume.Driver,
						created: inspect.CreatedAt || '',
						mountpoint: inspect.Mountpoint || '',
						labels: inspect.Labels || {},
						size: 'Unknown', // Docker doesn't provide size info for volumes by default
					}
				} catch (error) {
					return {
						name: volume.Name,
						driver: volume.Driver,
						created: '',
						mountpoint: '',
						labels: {},
						size: 'Unknown',
					}
				}
			})
		)

		return NextResponse.json(volumeDetails)
	} catch (error: any) {
		const rawMessage = typeof error?.stderr === 'string' && error.stderr.trim().length > 0
			? error.stderr
			: (typeof error?.message === 'string' ? error.message : 'Failed to fetch volumes')

		const message = String(rawMessage)
		const lower = message.toLowerCase()

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

		if (
			lower.includes('cannot connect to the docker daemon') ||
			lower.includes('is the docker daemon running') ||
			lower.includes('connect: no such file or directory')
		) {
			return NextResponse.json({
				errorCode: 'DOCKER_DAEMON_UNAVAILABLE',
				message: 'Docker daemon is not running or unreachable.',
				suggestions: [
					"Start the Docker service (e.g. 'sudo systemctl start docker')",
					"Verify that 'docker ps' works in your shell",
				],
				stderr: message,
			}, { status: 503 })
		}

		return NextResponse.json({ error: 'Failed to fetch volumes', stderr: message }, { status: 500 })
	}
}
