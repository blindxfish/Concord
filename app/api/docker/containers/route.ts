import { NextResponse } from 'next/server'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

export async function GET() {
	try {
		// Get all containers (running and stopped)
		const { stdout: containersOutput } = await execAsync('docker ps -a --format "{{json .}}" --no-trunc')
		const containerLines = containersOutput.split('\n').filter(Boolean)
		const containers = containerLines.map(line => {
			try {
				return JSON.parse(line)
			} catch {
				return null
			}
		}).filter(Boolean)

		// Get all images
		const { stdout: imagesOutput } = await execAsync('docker images --format "{{json .}}"')
		const imageLines = imagesOutput.split('\n').filter(Boolean)
		const images = imageLines.map(line => {
			try {
				return JSON.parse(line)
			} catch {
				return null
			}
		}).filter(Boolean)

		// Create a map of image tags to image IDs for quick lookup
		const imageMap = new Map()
		images.forEach(img => {
			const key = `${img.Repository}:${img.Tag}`
			const imageId = img.ID?.replace('sha256:', '').slice(0, 12)
			imageMap.set(key, imageId)
		})

		// Get container details with inspect
		const containerDetails = await Promise.all(
			containers.map(async (container) => {
				try {
					const { stdout: inspectOutput } = await execAsync(`docker inspect ${container.ID}`)
					const inspect = JSON.parse(inspectOutput)[0]
					
					// Get the image ID by looking up the container's image tag
					const imageId = imageMap.get(container.Image) || 'unknown'
					
					return {
						id: container.ID,
						name: container.Names?.replace('/', '') || 'unnamed',
						image: container.Image,
						imageId: imageId,
						status: container.Status,
						state: container.State,
						created: container.CreatedAt,
						ports: container.Ports || '',
						labels: inspect.Config?.Labels || {},
						volumes: inspect.Mounts?.map((mount: any) => mount.Destination).filter(Boolean) || [],
						command: container.Command || '',
					}
				} catch (error) {
					return {
						id: container.ID,
						name: container.Names?.replace('/', '') || 'unnamed',
						image: container.Image,
						imageId: 'unknown',
						status: container.Status,
						state: container.State,
						created: container.CreatedAt,
						ports: container.Ports || '',
						labels: {},
						volumes: [],
						command: container.Command || '',
					}
				}
			})
		)

		// Get image details
		const imageDetails = images.map(img => ({
			id: img.ID?.replace('sha256:', '').slice(0, 12),
			repository: img.Repository || '<none>',
			tag: img.Tag || '<none>',
			size: img.Size || '',
			created: img.CreatedAt || '',
		}))

		return NextResponse.json({
			containers: containerDetails,
			images: imageDetails,
		})
	} catch (error: any) {
		const rawMessage = typeof error?.stderr === 'string' && error.stderr.trim().length > 0
			? error.stderr
			: (typeof error?.message === 'string' ? error.message : 'Failed to fetch containers')

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

		return NextResponse.json({ error: 'Failed to fetch containers', stderr: message }, { status: 500 })
	}
}
