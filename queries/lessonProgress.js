// @/queries/lessonProgress.js
// "server-only"

import { createConnection } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";


export async function createLessonProgress({ user_id, lesson_id, course_id }) {
  try {
    const db = await createConnection();

    const query = `
      INSERT INTO lesson_progress (
        id, user_id, lesson_id, course_id, state, last_time, created_at, modified_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    const id = uuidv4().replace(/-/g, "").slice(0, 24);

    const values = [
      id,
      user_id,
      lesson_id,
      course_id,
      1,          // state = completed
      0,          // last_time (could be updated with playback position)
      now,
      now
    ];

    const [result] = await db.execute(query, values);
    return { id, user_id, lesson_id, course_id, state: 1 };
  } catch (error) {
    console.error("Error inserting lesson progress:", error);
    throw new Error("Database insert failed");
  }
}

export async function checkLessonProgressExists({ userId, id, lessonId }) {
  const db = await createConnection();
  try {
    const query = `
      SELECT id FROM lesson_progress 
      WHERE user_id = ? AND course_id = ? AND lesson_id = ? 
      LIMIT 1
    `;
    const [rows] = await db.execute(query, [userId, id, lessonId]);

    return rows.length > 0; // Return true if the progress exists
  } catch (error) {
    console.error(`Error checking progress for user ${userId} in course ${id} on lesson ${lessonId}:`, error);
    throw new Error("Database query failed.");
  }
}


export async function countStudentLessonsProgress(userId, course_id ) {
  try {
    if (!userId || !course_id) {
      throw new Error("User ID and Course ID are required");
    }

    const db = await createConnection();

    const query = `
      SELECT COUNT(id) AS completed_lessons
      FROM lesson_progress
      WHERE user_id = ? AND course_id = ?
    `;

    const [rows] = await db.execute(query, [userId, course_id]);

    return rows[0]?.completed_lessons || 0;
  } catch (error) {
    console.error(`Error counting completed lessons for user ${userId} in course ${course_id}:`, error);
    throw new Error("Failed to count completed lessons.");
  }
}



