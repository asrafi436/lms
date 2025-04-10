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

export async function getCourseProgress({ courseId, studentId }) {
  try {
    if (!courseId || !studentId) {
      throw new Error("Missing required parameters");
    }

    const db = await createConnection();

    const query = `
      SELECT course_progress 
      FROM reports 
      WHERE course_id = ? AND student_id = ?
    `;

    const [rows] = await db.execute(query, [courseId, studentId]);

    return rows[0]?.course_progress || 0;
  } catch (error) {
    console.error("Failed to get course progress:", error);
    throw new Error("Could not retrieve course progress.");
  }
}

export async function getCourseReports(courseId, studentId ) {
  try {
    if (!courseId || !studentId) {
      throw new Error("Missing required parameters");
    }

    const db = await createConnection();

    const query = `
      SELECT * 
      FROM reports 
      WHERE course_id = ? AND student_id = ? LIMIT 1
    `;

    const [rows] = await db.execute(query, [courseId, studentId]);

    if (rows.length === 0) {
      return null;  // No reports found for the given course and student
    }

    return rows[0]; // Return all matching report data
  } catch (error) {
    console.error("Failed to get course reports:", error);
    throw new Error("Could not retrieve course reports.");
  }
}


