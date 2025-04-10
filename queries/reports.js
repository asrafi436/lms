"use server";


import { createConnection } from "@/lib/db";

export async function updateCourseProgress({ courseId, studentId, progress }) {
  try {
    if (!courseId || !studentId) {
      throw new Error("Missing required parameters");
    }

    const db = await createConnection();

    const query = `
      UPDATE reports 
      SET course_progress = ? 
      WHERE course_id = ? AND student_id = ?
    `;

    const [result] = await db.execute(query, [progress, courseId, studentId]);

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Failed to update course progress:", error);
    throw new Error("Could not update course progress.");
  }
}

