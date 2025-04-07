'use server'

import { createConnection } from "@/lib/db";


export async function getQuizSets() {
    try {
      const db = await createConnection();
      const query = `SELECT * FROM quizsets`; // Removed the LIMIT clause to fetch all quiz sets
  
      const [quizsets] = await db.execute(query); // Extract rows (actual data)
  
      if (!quizsets || quizsets.length === 0) {
        console.error("No quiz sets found", quizsets);
        return []; // Return an empty array if no quiz sets are found
      }
  
      return quizsets; // Return the quiz sets if found
    } catch (error) {
      console.error("Error fetching quiz sets:", error);
      throw new Error("Failed to fetch quiz sets."); // Rethrow a new error to be handled by the caller
    }
  }
  