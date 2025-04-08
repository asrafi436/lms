
import { createConnection } from '@/lib/db.js';
import { NextResponse } from 'next/server'



export async function GET() {
    try {

        const db = await createConnection()

        const SQL_ENROLMENTS = `

                SELECT 
                c.id as course_id , c.title as course_title,
                e.id as enrollment_id , e.student_id as  student_id,
                u.first_name as student_f_name, u.last_name as student_l_name, u.email as student_email
                FROM 
                enrollments e 
                LEFT JOIN courses c ON e.course_id = c.id
                left join users u on e.student_id = u.id;
        
        `;
        const [enrollments] = await db.query(SQL_ENROLMENTS)
        return NextResponse.json({ enrollments })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.message })
    }
}