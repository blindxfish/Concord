import { NextResponse } from 'next/server'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

export async function GET() {
	try {
		// Using docker CLI to list images with a stable JSON format
		// Requires Docker CLI installed and user with permission to access Docker
		const format = '{{json .}}'
		const { stdout } = await execAsync(`docker images --all --no-trunc --format '${format}'`)
		const lines = stdout.split('\n').filter(Boolean)
		const raw = lines.map((line) => {
			try {
				return JSON.parse(line)
			} catch {
				return null
			}
		}).filter(Boolean) as any[]

		// Also get running containers to check which images are in use
		let runningImageIds = new Set()
		try {
			const { stdout: containersStdout } = await execAsync(`docker ps --format '{{json .}}'`)
			if (containersStdout.trim()) {
				containersStdout
					.trim()
					.split('\n')
					.filter(Boolean)
					.forEach((line) => {
						try {
							const container = JSON.parse(line)
							runningImageIds.add(container.ImageID)
						} catch (e) {
							// Ignore parsing errors
						}
					})
			}
		} catch (e) {
			// If we can't get container info, just continue without running status
		}

		const images = raw
			.filter((img) => {
				// Filter out intermediate layers (untagged images that are part of dependency chains)
				// Only show images that have both a repository AND a tag (not both '<none>')
				return !(img.Repository === '<none>' && img.Tag === '<none>')
			})
			.map((img) => ({
				repository: img.Repository ?? '<none>',
				tag: img.Tag ?? '<none>',
				id: (img.ID as string)?.replace('sha256:', '').slice(0, 12),
				size: img.Size ?? '',
				createdSince: img.CreatedSince ?? '',
				isRunning: runningImageIds.has(img.ID)
			}))

		return NextResponse.json(images)
	} catch (error: any) {
		const rawMessage = typeof error?.stderr === 'string' && error.stderr.trim().length > 0
			? error.stderr
			: (typeof error?.message === 'string' ? error.message : 'Failed to list images')

		const message = String(rawMessage)
		const lower = message.toLowerCase()

		// Permission denied to access docker.sock → 403
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

		// Daemon not running or unreachable → 503
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

		return NextResponse.json({ error: 'Failed to list images', stderr: message }, { status: 500 })
	}
}


