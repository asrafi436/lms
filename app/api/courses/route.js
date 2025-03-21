
import { createConnection } from '@/lib/db.js';
import { NextResponse } from 'next/server'



export async function GET() {
    try {

        const db = await createConnection()

        const SQL_COURSES = `
            SELECT
    c.id AS course_id,
    c.title AS course_title,
    c.subtitle AS course_subtitle,
    c.thumbnail AS course_thumbnail,
    c.price AS course_price,
    u.id AS instructor_id,
    u.first_name AS instructor_first_name,
    u.last_name AS instructor_last_name,
    u.email AS instructor_email,
    u.bio AS instructor_bio,
    ca.title AS category,
    (SELECT COUNT(*) FROM modules WHERE course_id = c.id) AS total_modules,
    m.id AS module_id,
    m.title AS module_title,
    m.description AS module_description,
    m.status AS module_status,
    m.slug AS module_slug,
    m.duration AS module_duration
FROM courses AS c
JOIN categories AS ca ON c.category_id = ca.id
JOIN users AS u ON c.instructor_id = u.id
LEFT JOIN modules AS m 
    ON m.id = (SELECT id FROM modules WHERE course_id = c.id ORDER BY id DESC LIMIT 1) -- Get latest module
ORDER BY total_modules DESC;

        `;
        const [courses] = await db.query(SQL_COURSES)
        return NextResponse.json({ courses })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.message })
    }
}