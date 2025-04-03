'use server'

import { createConnection } from '@/lib/db';

export const getCoursesData = async (userId) => {
    if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid userId provided');
    }

    let connection;
    try {
        connection = await createConnection(); // Create a new connection

        const [rows] = await connection.execute(
            `SELECT 
                c.id AS course_id, 
                c.title AS course_title, 
                c.price, 
                c.active, 
                e.student_id 
            FROM courses AS c 
            LEFT JOIN enrollments AS e ON c.id = e.course_id 
            WHERE c.instructor_id = ?`,
            [userId]
        );

        if (!rows.length) {
            return { instructor_id: userId, courses: {} };
        }

        // Process data to group students under courses
        const courseMap = {};

        rows.forEach(row => {
            if (!courseMap[row.course_id]) {
                courseMap[row.course_id] = {
                    course_title: row.course_title,
                    price: row.price,
                    active: row.active,
                    students: []
                };
            }
            if (row.student_id) {
                courseMap[row.course_id].students.push(row.student_id);
            }
        });

        return { 
            instructor_id: userId, 
            courses: courseMap 
        };

    } catch (error) {
        console.error('Error fetching courses by instructor:', error);
        throw new Error('Database query failed');
    }
};
