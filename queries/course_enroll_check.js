
"use client"

export const hasEnrollmentForCourse = async (courseId, studentId) => {
    if (!courseId || typeof courseId !== 'string' || !studentId || typeof studentId !== 'string') {
        throw new Error('Invalid courseId or studentId provided');
    }

    let connection;
    try {
        connection = await createConnection(); // create a new connection
        const [rows] = await connection.execute(
            'SELECT * FROM enrollments WHERE course_id = ? AND student_id = ? LIMIT 1',
            [courseId, studentId]
        );
        return rows.length > 0;
    } catch (error) {
        console.error('Error checking enrollment:', error);
        throw new Error('Database query failed');
    }
};
