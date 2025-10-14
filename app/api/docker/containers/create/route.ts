import { NextResponse } from 'next/server'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

export async function POST(request: Request) {
	try {
		const { image, name, serviceName, volume, port } = await request.json()
		
		if (!image || !name) {
			return NextResponse.json({ error: 'Image and name are required' }, { status: 400 })
		}

		// Build docker create command with optional parameters
		let command = `docker create --name ${name}`
		
		// Add volume if specified
		if (volume) {
			command += ` -v ${volume}:/app/data`
		}
		
		// Add port mapping if specified
		if (port) {
			command += ` -p ${port}:3000`
		}
		
		// Add concord labels for proper service organization
		const timestamp = Math.floor(Date.now() / 1000)
		command += ` --label concord.service="${serviceName || 'unknown-service'}"`
		command += ` --label concord.version="latest"`
		command += ` --label concord.build="${timestamp}"`
		
		// Add the image
		command += ` ${image}`
		
		await execAsync(command)
		
		return NextResponse.json({ 
			success: true, 
			message: `Container ${name} created from ${image}`,
			containerName: name,
			volume: volume || null,
			port: port || null
		})
	} catch (error: any) {
		return NextResponse.json({ 
			error: error?.message || 'Failed to create container' 
		}, { status: 500 })
	}
}
