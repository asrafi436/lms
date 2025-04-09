"use server"

import { createConnection } from '@/lib/db'; // adjust this path to your db connection file

export const getModulesWithLessonsByCourseId = async (courseId) => {
    if (!courseId || typeof courseId !== 'string') {
        throw new Error('Invalid course ID provided');
    }

    let connection;
    try {
        connection = await createConnection();

        // Fetch modules and lessons without JSON formatting in SQL
        const [rows] = await connection.execute(
            `
            SELECT
              m.course_id AS course_id,
              m.id AS module_id,
              m.title AS module_title,
              m.description AS module_description,
              m.duration AS module_duration,
              m.order AS module_order, m.status as module_status,
              l.id AS lesson_id,
              l.title AS lesson_title,
              l.description AS lesson_description,
              l.duration AS lesson_duration,
              l.video_url AS video_url,
              l.published AS published,
              l.order AS lesson_order,
              l.access as lesson_access
            FROM modules m
            LEFT JOIN lessons l ON l.module_id = m.id
            WHERE m.course_id = ?
            ORDER BY m.order, l.order;
            `,
            [courseId]
        );

        // Process the raw data into a structured format
        const modules = [];
        let currentModule = null;

        rows.forEach((row) => {
            // If the module has changed, push the previous one and start a new one
            if (!currentModule || currentModule.module_id !== row.module_id) {
                if (currentModule) {
                    modules.push(currentModule);
                }

                currentModule = {
                    module_id: row.module_id,
                    module_title: row.module_title,
                    module_description: row.module_description,
                    module_duration: row.module_duration,
                    module_order: row.module_order,
                    module_status: row.module_status,
                    lessons: [],
                };
            }

            // Add the lesson to the current module's lessons array
            currentModule.lessons.push({
                lesson_id: row.lesson_id,
                lesson_title: row.lesson_title,
                lesson_description: row.lesson_description,
                lesson_duration: row.lesson_duration,
                video_url: row.video_url,
                published: row.published,
                lesson_order: row.lesson_order,
                lesson_access: row.lesson_access,
            });
        });

        // Don't forget to add the last module to the result
        if (currentModule) {
            modules.push(currentModule);
        }

        return modules;
    } catch (error) {
        console.error('Error fetching modules and lessons:', error);
        throw new Error('Database query failed');
    }
};
