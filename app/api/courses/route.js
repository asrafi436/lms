
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
   ca.title AS category_title,
   (SELECT COUNT(*) FROM modules WHERE course_id = c.id) AS total_modules,
   (
       SELECT GROUP_CONCAT(m.id SEPARATOR ',')
       FROM modules m
       WHERE m.course_id = c.id
   ) AS module_ids,
   q.id AS quizset_id,
   q.title AS quizset_title,
   (
       SELECT GROUP_CONCAT(t.id SEPARATOR ',')
       FROM testimonials t
       WHERE t.course_id = c.id
   ) AS testimonial_ids,
   c.learning AS learning_points,
   c.created_on AS created_on,
   c.modified_on AS modified_on
FROM 
   courses AS c
JOIN categories AS ca ON c.category_id = ca.id
JOIN users AS u ON c.instructor_id = u.id
LEFT JOIN quizsets AS q ON c.quizset_id = q.id
ORDER BY total_modules DESC;
            `;
        const [courses] = await db.query(SQL_COURSES)
        return NextResponse.json({ courses })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.message })
    }
}