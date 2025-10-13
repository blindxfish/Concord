import { NextResponse } from 'next/server'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
	try {
		const { id } = params
		
		// Stop container first if it's running
		try {
			await execAsync(`docker stop ${id}`)
		} catch {
			// Container might already be stopped, ignore error
		}
		
		// Remove the container
		await execAsync(`docker rm ${id}`)
		
		return NextResponse.json({ success: true, message: `Container ${id} deleted` })
	} catch (error: any) {
		return NextResponse.json({ 
			error: error?.message || 'Failed to delete container' 
		}, { status: 500 })
	}
}
