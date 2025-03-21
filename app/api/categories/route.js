
import { createConnection } from '@/lib/db.js';
import { NextResponse } from 'next/server'



export async function GET() {
    try {

        const db = await createConnection()

        const SQL_categories = `SELECT * FROM categories`;
        const [categories] = await db.query(SQL_categories)
        return NextResponse.json({ categories })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.message })
    }
}