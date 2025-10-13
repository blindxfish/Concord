import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const imageId = params.id
		
		// First, check if the image exists
		const { stdout: imageCheck } = await execAsync(`docker images --format "{{.ID}}" | grep "^${imageId}"`)
		if (!imageCheck.trim()) {
			return NextResponse.json({ error: 'Image not found' }, { status: 404 })
		}

		// Check if any containers are using this image
		const { stdout: containerCheck } = await execAsync(`docker ps -a --filter ancestor=${imageId} --format "{{.ID}}"`)
		if (containerCheck.trim()) {
			return NextResponse.json({ 
				error: 'Cannot delete image: containers are using this image',
				containers: containerCheck.trim().split('\n')
			}, { status: 400 })
		}

		// Try to delete the image normally first
		try {
			await execAsync(`docker rmi ${imageId}`)
		} catch (normalError: any) {
			// If normal deletion fails due to multiple repository references, try with force
			if (normalError.message?.includes('must be forced') || normalError.message?.includes('referenced in multiple repositories')) {
				await execAsync(`docker rmi --force ${imageId}`)
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
