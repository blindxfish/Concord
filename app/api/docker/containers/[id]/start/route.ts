import { NextResponse } from 'next/server'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

export async function POST(request: Request, { params }: { params: { id: string } }) {
	try {
		const { id } = params
		
		await execAsync(`docker start ${id}`)
		
		return NextResponse.json({ success: true, message: `Container ${id} started` })
	} catch (error: any) {
		return NextResponse.json({ 
			error: error?.message || 'Failed to start container' 
		}, { status: 500 })
	}
}
