'use server';

import { createConnection } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function createReview(data, loginid, courseId) {
  try {
    const db = await createConnection();

    const { rating, review: content } = data;

    // Check if a testimonial already exists
    const checkQuery = `
      SELECT id FROM testimonials
      WHERE course_id = ? AND user_id = ?
      LIMIT 1
    `;

    const [rows] = await db.execute(checkQuery, [courseId, loginid]);

    if (rows.length > 0) {
      // Testimonial exists → UPDATE it
      const testimonialId = rows[0].id;

      const updateQuery = `
        UPDATE testimonials
        SET content = ?, rating = ?
        WHERE id = ?
      `;

      await db.execute(updateQuery, [content, rating, testimonialId]);

      return {
        success: true,
        message: "Testimonial updated successfully",
        testimonialId,
      };
    } else {
      // No testimonial → INSERT new
      const newId = uuidv4().replace(/-/g, "").slice(0, 24); // 24-char UUID

      const insertQuery = `
        INSERT INTO testimonials (id, content, rating, course_id, user_id)
        VALUES (?, ?, ?, ?, ?)
      `;

      await db.execute(insertQuery, [newId, content, rating, courseId, loginid]);

      return {
        success: true,
        message: "Testimonial created successfully",
        testimonialId: newId,
      };
    }
  } catch (error) {
    console.error("Error in createReview:", error);
    throw new Error("Failed to create or update testimonial.");
  }
}
