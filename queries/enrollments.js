'use server';

import { createConnection } from '@/lib/db';

export const getEnrolledCourses = async (userId) => {
    if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user ID provided');
    }

    let connection;
    try {
        connection = await createConnection(); // create a new connection
        const [rows] = await connection.execute(
            `SELECT 
    e.*, 
    c.id AS course_id,
    c.title AS course_title,
    c.subtitle AS course_subtitle,
    c.description AS course_description,
    c.thumbnail AS course_thumbnail,
    c.price AS course_price,
    c.active AS course_active,
    c.learning AS learning_points,
    c.created_on AS course_created_on,
    c.modified_on AS course_modified_on,

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

FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN users u ON c.instructor_id = u.id
JOIN categories ca ON c.category_id = ca.id
JOIN quizsets q ON c.quizset_id = q.id
WHERE e.student_id = ?;
`,
            [userId]
        );

        return rows.length ? rows : [];
    } catch (error) {
        console.error('Error fetching enrollments for user:', error);
        throw new Error('Database query failed');
    }
};
