import { NextResponse } from 'next/server'
import { isDefaultPassword } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ isDefault: isDefaultPassword() })
}


