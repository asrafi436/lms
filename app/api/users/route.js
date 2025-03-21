import { createConnection } from '@/lib/db.js';
import { NextResponse } from 'next/server'



export async function GET(){
    try{
        const db = await createConnection()
        const SQL_USERS = "SELECT * FROM users"
        const [users] = await db.query(SQL_USERS)
        return NextResponse.json({users})
    }catch(error){
        console.error(error)
        return NextResponse.json({error: error.message})
    }
}