'use server'

import { createConnection } from "@/lib/db";

export async function getQuizsetQuizzes() {
    try {
      const db = await createConnection();
      const query = `SELECT * FROM quizset_quizzes`; // Removed the LIMIT clause to fetch all quizset quizzes
  
      const [quizsetQuizzes] = await db.execute(query); // Extract rows (actual data)
  
      if (!quizsetQuizzes || quizsetQuizzes.length === 0) {
        console.error("No quizset quizzes found", quizsetQuizzes);
        return []; // Return an empty array if no quizset quizzes are found
      }
  
      return quizsetQuizzes; // Return the quizset quizzes if found
    } catch (error) {
      console.error("Error fetching quizset quizzes:", error);
      throw new Error("Failed to fetch quizset quizzes."); // Rethrow a new error to be handled by the caller
    }
  }
  