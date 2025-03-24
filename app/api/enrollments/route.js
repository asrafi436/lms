
import { createConnection } from '@/lib/db.js';
import { NextResponse } from 'next/server'



export async function GET() {
    try {

        const db = await createConnection()

        const SQL_ENROLMENTS = `SELECT * from enrollments`;
        const [enrollments] = await db.query(SQL_ENROLMENTS)
        return NextResponse.json({ enrollments })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.message })
    }
}