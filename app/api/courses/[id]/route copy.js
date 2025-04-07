import { createConnection } from '@/lib/db.js';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    const { id } = params ?? {};

    try {
        console.log("Fetching course with ID:", id); // Debugging

        const db = await createConnection();

        const SQL_COURSE = `SELECT 
    c.id AS course_id,
    c.title AS course_title,
    c.subtitle AS course_subtitle,
    c.description AS course_description,
    c.thumbnail AS course_thumbnail,
    c.price AS course_price,
    c.active AS course_active,
    c.learning AS learning_points,
    c.created_on AS created_on,
    c.modified_on AS modified_on,

    -- Instructor details
    u.id AS instructor_id,
    u.first_name AS instructor_first_name,
    u.last_name AS instructor_last_name,
    u.email AS instructor_email,
    u.bio AS instructor_bio,
    u.profile_picture AS instructor_profile_picture,
    u.designation AS instructor_designation,

    -- Category details
    ca.id AS category_id,
    ca.title AS category_title,
    ca.description AS category_description,

    -- Quizset details
    q.id AS quizset_id,
    q.title AS quizset_title,
    q.description AS quizset_description,

    -- Course modules with lessons
    (
        SELECT IFNULL(
            CONCAT(
                '[', 
                GROUP_CONCAT(
                    JSON_OBJECT(
                        'module_id', m.id,
                        'module_title', m.title,
                        'module_description', m.description,
                        'slug', m.slug,
                        'status', m.status,
                        'lessons', (
                            SELECT IFNULL(
                                CONCAT(
                                    '[', 
                                    GROUP_CONCAT(
                                        JSON_OBJECT(
                                            'lesson_oid', l.id,
                                            'title', l.title,
                                            'description', l.description,
                                            'duration', l.duration,
                                            'video_url', l.video_url,
                                            'published', l.published,
                                            'slug', l.slug,
                                            'access', l.access
                                        )
                                    SEPARATOR ','), ']'), '[]'
                            )
                            FROM lessons l
                            WHERE l.module_id = m.id
                        )
                    )
                    SEPARATOR ','), 
                ']'
            ), 
        '[]')
        FROM modules m
        WHERE m.course_id = c.id
    ) AS course_modules,

    -- Course testimonials
    (
        SELECT IFNULL(CONCAT('[', GROUP_CONCAT(
            JSON_OBJECT(
                'id', t.id,
                'content', t.content,
                'rating', t.rating,
                'user', JSON_OBJECT(
                    'id', u.id,
                    'first_name', u.first_name,
                    'last_name', u.last_name,
                    'email', u.email
                )
            )
            SEPARATOR ','), ']'), '[]')
        FROM testimonials t
        JOIN users u ON t.user_id = u.id
        WHERE t.course_id = c.id
    ) AS course_testimonials

FROM courses c
JOIN users u ON c.instructor_id = u.id
JOIN categories ca ON c.category_id = ca.id
JOIN quizsets q ON c.quizset_id = q.id
WHERE c.id = ?;`;

        const [course] = await db.query(SQL_COURSE, [id]);

        if (course.length === 0) {
            return NextResponse.json({ message: "Course not found" }, { status: 404 });
        }

        return NextResponse.json({ course: course[0] });

    } catch (error) {
        console.error("Database Error:", error.message); // Log the error
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}