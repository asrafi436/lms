import { createConnection } from '@/lib/db.js';
import { v4 as uuidv4 } from 'uuid';

export async function insertEnrollment(enrollmentData) {
    try {
        const db = await createConnection();
        const SQL_INSERT_ENROLLMENT = `INSERT INTO enrollments (id, enrollment_date, status, completion_date, method, course_id, student_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const enrollmentId = uuidv4().replace(/-/g, '').slice(0, 24);

        const [result] = await db.query(SQL_INSERT_ENROLLMENT, [
            enrollmentId,
            enrollmentData.enrollment_date,
            enrollmentData.status,
            enrollmentData.completion_date,
            enrollmentData.method,
            enrollmentData.course_id,
            enrollmentData.student_id,
        ]);

        return { message: 'Enrollment recorded successfully', enrollmentId };
    } catch (error) {
        console.error('Error inserting enrollment:', error);
        throw new Error('Failed to insert enrollment');
    }
}
