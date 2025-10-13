import { NextResponse } from 'next/server'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

export async function POST(request: Request) {
	try {
		const { image, name, serviceName } = await request.json()
		
		if (!image || !name) {
			return NextResponse.json({ error: 'Image and name are required' }, { status: 400 })
		}

		// Create container with basic configuration
		// You can extend this with more options like ports, volumes, etc.
		const command = `docker create --name ${name} ${image}`
		await execAsync(command)
		
		return NextResponse.json({ 
			success: true, 
			message: `Container ${name} created from ${image}`,
			containerName: name
		})
	} catch (error: any) {
		return NextResponse.json({ 
			error: error?.message || 'Failed to create container' 
		}, { status: 500 })
	}
}
