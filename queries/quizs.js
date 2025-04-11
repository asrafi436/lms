'use server';

import { createConnection } from "@/lib/db";

export async function getQuizByCourseID(courseId) {
  try {
    const db = await createConnection();

    const query = `
      SELECT
        qs.id as quizset_id,
        qs.title as quizset_title,
        q.id as question_id,
        q.question,
        q.description,
        q.explanations,
        q.slug,
        q.option1_text,
        q.option1_is_correct,
        q.option2_text,
        q.option2_is_correct,
        q.option3_text,
        q.option3_is_correct,
        q.option4_text,
        q.option4_is_correct
      FROM quizzes q
      JOIN quizset_quizzes qq ON q.id = qq.quiz_id
      JOIN quizsets qs ON qq.quizset_id = qs.id
      WHERE qs.status != 0
        AND qq.quizset_id = (
          SELECT quizset_id
          FROM courses
          WHERE id = ?
        )
      ORDER BY qs.id, q.id;
    `;

    const [quizzes] = await db.execute(query, [courseId]);

    // Handle case where no quizzes are found
    if (!quizzes || quizzes.length === 0) {
      console.warn("No quizzes found for course ID:", courseId);
      return [];
    }

    return quizzes;
  } catch (error) {
    console.error("Error fetching quizzes by course ID:", error);
    throw new Error("Failed to fetch quizzes.");
  }
}
