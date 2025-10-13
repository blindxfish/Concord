import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST() {
	try {
		// Get all untagged images (dangling images)
		const { stdout } = await execAsync(`docker images --filter "dangling=true" -q`)
		const imageIds = stdout.trim().split('\n').filter(Boolean)
		
		if (imageIds.length === 0) {
			return NextResponse.json({ 
				success: true, 
				message: 'No untagged images found to clean up',
				deletedCount: 0 
			})
		}

		// Delete all untagged images
		await execAsync(`docker rmi --force ${imageIds.join(' ')}`)
		
		return NextResponse.json({ 
			success: true, 
			message: `Successfully deleted ${imageIds.length} untagged images`,
			deletedCount: imageIds.length 
		})
	} catch (error: any) {
		console.error('Error cleaning up images:', error)
		return NextResponse.json(
			{ error: error.message || 'Failed to clean up images' },
			{ status: 500 }
		)
	}
}
