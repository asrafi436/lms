import { createConnection } from '@/lib/db.js';
import { v4 as uuidv4 } from 'uuid';

export async function insertEnrollment(enrollmentData) {
    try {
        const db = await createConnection();
        const SQL_INSERT_ENROLLMENT = `
            INSERT INTO enrollments (id, enrollment_date, status, completion_date, method, course_id, student_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const SQL_INSERT_REPORT = `
            INSERT INTO reports(id, course_id, student_id, quizAssessment_id, enrollment_id, course_progress, quiz_mark)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const enrollmentId = uuidv4().replace(/-/g, '').slice(0, 24);
        const reportId = uuidv4().replace(/-/g, '').slice(0, 24);

        console.log("Attempting to insert enrollment:", enrollmentData);

        // Insert into enrollments
        await db.query(SQL_INSERT_ENROLLMENT, [
            enrollmentId,
            enrollmentData.enrollment_date,
            enrollmentData.status,
            enrollmentData.completion_date,
            enrollmentData.method,
            enrollmentData.course_id,
            enrollmentData.student_id,
        ]);

        // Insert into reports with hardcoded defaults
        await db.query(SQL_INSERT_REPORT, [
            reportId,
            enrollmentData.course_id,
            enrollmentData.student_id,
            null,          // quizAssessment_id (not provided)
            enrollmentId,
            0,             // course_progress default
            0              // quiz_mark default
        ]);

        return { message: 'Enrollment and report recorded successfully', enrollmentId, reportId };
    } catch (error) {
        console.error('Error inserting enrollment or report:', error);
        throw new Error('Failed to insert enrollment and report');
    }
}
