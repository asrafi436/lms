import { createConnection } from '@/lib/db';

export const getCourseTestimonial = async (courseId) => {
    if (!courseId || typeof courseId !== 'string') {
        throw new Error('Invalid courseId provided');
    }

    let connection;
    try {
        connection = await createConnection(); // Create a new connection

        // Execute the SQL query to fetch testimonials with student names
        const [rows] = await connection.execute(
            `SELECT 
                t.id AS testimonial_id, 
                t.content AS testimonial_content, 
                t.rating AS testimonial_rating, 
                t.created_at AS testimonial_created_at,
                u.first_name AS student_first_name,
                u.last_name AS student_last_name
            FROM 
                testimonials t
            JOIN 
                users u ON t.user_id = u.id
            WHERE 
                t.course_id = ?`, // Filter by course_id using parameterized query
            [courseId]
        );

        // Check if no testimonials are found for the course
        if (!rows.length) {
            return { course_id: courseId, testimonials: [] };
        }

        // Format the results to match the expected structure
        const testimonials = rows.map(row => ({
            testimonial_id: row.testimonial_id,
            testimonial_content: row.testimonial_content,
            testimonial_rating: row.testimonial_rating,
            testimonial_created_at: row.testimonial_created_at,
            student_name: `${row.student_first_name} ${row.student_last_name}` // Combining first and last name
        }));

        return { course_id: courseId, testimonials };

    } catch (error) {
        console.error('Error fetching testimonials:', error);
        throw new Error('Database query failed');
    }
};


export const getEnrollmentsData = async (courseId) => {
    if (!courseId || typeof courseId !== 'string') {
        throw new Error('Invalid courseId provided');
    }

    let connection;
    try {
        connection = await createConnection(); // Create a new connection

        // Execute the SQL query to fetch enrollments with student details and quiz marks
        const [rows] = await connection.execute(
            `SELECT 
                u.first_name AS student_first_name,
                u.last_name AS student_last_name,
                u.email AS student_email,
                qa.mark AS quiz_mark,
                CASE 
                    WHEN e.status = 'complete' THEN '100%' 
                    WHEN e.status = 'pending' THEN '0%' 
                    ELSE 'N/A' 
                END AS progress,
                e.enrollment_date AS enroll_date
            FROM 
                enrollments e
            JOIN 
                users u ON e.student_id = u.id
            LEFT JOIN 
                quiz_assessments qa ON e.course_id = qa.course_id AND e.student_id = qa.user_id
            WHERE 
                e.course_id = ?
            ORDER BY 
                e.enrollment_date;
            `, // Filter by course_id using parameterized query
            [courseId]
        );

        // Check if no rows are returned
        if (!rows.length) {
            return { course_id: courseId, data: [] };
        }

        // Format the results to match the expected structure
        const enrollmentsData = rows.map(row => ({
            date: row.enroll_date,
            student: {
                name: `${row.student_first_name} ${row.student_last_name}`,
                email: row.student_email,
                progress: row.progress,
                quizMark: row.quiz_mark || 'N/A', // If no quiz mark is found, set it to N/A
            }
        }));

        return { course_id: courseId, enrollments: enrollmentsData };

    } catch (error) {
        console.error('Error fetching enrollments data:', error);
        throw new Error('Database query failed');
    }
};
