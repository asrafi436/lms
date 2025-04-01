'use server';

import { createConnection } from '@/lib/db';

export const getInstructorWiseCourse = async (userId) => {
    if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user ID provided');
    }

    let connection;
    try {
        connection = await createConnection(); // create a new connection
        
        // Log the SQL query for debugging
        console.log('Executing query for userId:', userId);

        const [rows] = await connection.execute(
            `SELECT 
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
                u.id AS instructor_id,
                u.first_name AS instructor_first_name,
                u.last_name AS instructor_last_name,
                u.email AS instructor_email,
                u.bio AS instructor_bio,
                u.profile_picture AS instructor_profile_picture,
                u.designation AS instructor_designation,
                ca.id AS category_id,
                ca.title AS category_title,
                ca.description AS category_description,
                q.id AS quizset_id,
                q.title AS quizset_title,
                q.description AS quizset_description
            FROM courses c
            JOIN users u ON c.instructor_id = u.id
            JOIN categories ca ON c.category_id = ca.id
            JOIN quizsets q ON c.quizset_id = q.id
            WHERE u.id = ?`,
            [userId]
        );

        return rows.length ? rows : [];
    } catch (error) {
        console.error('Error fetching instructor data:', error); // Log detailed error
        throw new Error(`Database query failed: ${error.message}`);
    }
};
