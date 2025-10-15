import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const url = new URL(request.url)
		const forceCascade = url.searchParams.get('cascade') === '1' || url.searchParams.get('force') === '1'
		const shortId = params.id
		const fullSha = shortId.startsWith('sha256:') ? shortId : `sha256:${shortId}`
		
		// First, check if the image exists (robust, no-trunc)
		try {
			const { stdout: imageCheck } = await execAsync(`docker images --no-trunc --format '{{.ID}}' | grep -E '^(${fullSha}|${shortId})' || true`)
			if (!imageCheck.trim()) {
				return NextResponse.json({ error: 'Image not found' }, { status: 404 })
			}
		} catch {
			return NextResponse.json({ error: 'Image not found' }, { status: 404 })
		}

		// Discover containers referencing this image using ancestor filter (compatible across Docker versions)
		const blockingSet = new Set<string>()
		const addLines = (s: string) => s.split('\n').filter(Boolean).forEach(id => blockingSet.add(id.trim()))

		// by full sha and short id
		try { const { stdout } = await execAsync(`docker ps -a --filter ancestor=${fullSha} --format '{{.ID}}'`); addLines(stdout) } catch {}
		try { const { stdout } = await execAsync(`docker ps -a --filter ancestor=${shortId} --format '{{.ID}}'`); addLines(stdout) } catch {}

		// also by any repo tags of the image
		try {
			const { stdout: tagsOut } = await execAsync(`docker inspect --format '{{json .RepoTags}}' ${shortId}`)
			const tags = JSON.parse(tagsOut || '[]') as string[]
			for (const tag of tags) {
				if (!tag) continue
				try { const { stdout } = await execAsync(`docker ps -a --filter ancestor=${tag} --format '{{.ID}}'`); addLines(stdout) } catch {}
			}
		} catch {}

		const blocking = Array.from(blockingSet)

		if (blocking.length > 0) {
			if (forceCascade) {
				// Stop and remove blocking containers
				for (const cid of blocking) {
					try { await execAsync(`docker stop ${cid}`) } catch {}
					try { await execAsync(`docker rm ${cid}`) } catch {}
				}
			} else {
				return NextResponse.json({
					error: 'Cannot delete image: containers are using this image',
					containers: blocking
				}, { status: 400 })
			}
		}

		// Try to delete the image normally first
		try {
			await execAsync(`docker rmi ${fullSha} || docker rmi ${shortId}`)
		} catch (normalError: any) {
			// If normal deletion fails due to multiple repository references, try with force
			if (normalError.message?.includes('must be forced') || normalError.message?.includes('referenced in multiple repositories')) {
				await execAsync(`docker rmi --force ${fullSha} || docker rmi --force ${shortId}`)
			} else {
				throw normalError
			}
		}
		
		return NextResponse.json({ success: true })
	} catch (error: any) {
		console.error('Error deleting image:', error)
		return NextResponse.json(
			{ error: error.message || 'Failed to delete image' },
			{ status: 500 }
		)
	}
}
