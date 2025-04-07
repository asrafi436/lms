'use server';

import { createConnection } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";


export async function getQuizzes() {
    try {
        const db = await createConnection();
        const query = `SELECT * FROM quizzes`;

        const [quizzes] = await db.execute(query);

        if (!quizzes || quizzes.length === 0) {
            console.error("No quizzes found", quizzes);
            return [];
        }

        // Transform the quiz data
        const transformedQuizzes = quizzes.map(quiz => ({
            id: quiz.id,
            question: quiz.question,
            description: quiz.description,
            explanations: quiz.explanations,
            mark: quiz.mark,
            slug: quiz.slug,
            options: {
                option1: {
                    text: quiz.option1_text,
                    is_correct: !!quiz.option1_is_correct,
                },
                option2: {
                    text: quiz.option2_text,
                    is_correct: !!quiz.option2_is_correct,
                },
                option3: {
                    text: quiz.option3_text,
                    is_correct: !!quiz.option3_is_correct,
                },
                option4: {
                    text: quiz.option4_text,
                    is_correct: !!quiz.option4_is_correct,
                },
            }
        }));

        return transformedQuizzes;
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        throw new Error("Failed to fetch quizzes.");
    }
}

export async function createQuizSet(quizSetData) {
  try {
    const db = await createConnection(); // Get a DB connection

    const query = `
      INSERT INTO quizsets (
        id,
        title,
        instructor_id
      ) VALUES (?, ?, ?)
    `;

    const values = [
      quizSetData.id,
      quizSetData.title,
      quizSetData.instructor_id
    ];

    const [result] = await db.execute(query, values);
    return { id: quizSetData.id, ...quizSetData }; // Return inserted quizSet
  } catch (error) {
    console.error("Error inserting quiz set:", error);
    throw new Error("Quiz set insert failed");
  }
}




export async function updateQSTitles(quizsetId, dataToUpdate) {
    try {
        const db = await createConnection();

        const { title } = dataToUpdate;

        const query = `
            UPDATE quizsets
            SET title = ?
            WHERE id = ?
        `;

        const [result] = await db.execute(query, [title, quizsetId]);

        return result;
    } catch (error) {
        console.error("Error updating quiz set title:", error);
        throw new Error("Failed to update quiz set title.");
    }
}

export async function deleteQuizset(quizsetId) {
  try {
    if (!quizsetId) {
      throw new Error("Quizset ID is required");
    }

    const db = await createConnection();

    // Query to delete a quizset by its ID
    const query = `
      DELETE FROM quizsets
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [quizsetId]);

    // Check if any rows were affected (i.e., if the quizset was deleted)
    if (result.affectedRows === 0) {
      throw new Error("Quizset not found or already deleted");
    }

    return { success: true, message: "Quizset deleted successfully" };
  } catch (error) {
    console.error("Error deleting quizset:", error);
    throw new Error("Failed to delete quizset.");
  }
}




// Insert into both `quizzes` and `quizset_quizzes`
export async function createQuizWithQuizset(quizData) {
  const db = await createConnection();

  try {
    // Insert quiz into `quizzes` table
    const quizInsertQuery = `
      INSERT INTO quizzes (
        id, question, description, explanations, mark, slug,
        option1_text, option1_is_correct,
        option2_text, option2_is_correct,
        option3_text, option3_is_correct,
        option4_text, option4_is_correct
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const quizValues = [
      quizData.id,
      quizData.question,
      quizData.description,
      quizData.explanations,
      quizData.mark,
      quizData.slug,
      quizData.option1_text,
      quizData.option1_is_correct,
      quizData.option2_text,
      quizData.option2_is_correct,
      quizData.option3_text,
      quizData.option3_is_correct,
      quizData.option4_text,
      quizData.option4_is_correct
    ];

    await db.execute(quizInsertQuery, quizValues);

    // Insert into `quizset_quizzes` table
    const quizsetQuizInsertQuery = `
      INSERT INTO quizset_quizzes (id, quizset_id, quiz_id)
      VALUES (?, ?, ?)
    `;

    const quizsetQuizValues = [
      uuidv4().replace(/-/g, ""), // Generate 24-character hex string
      quizData.quizset_id,
      quizData.id
    ];

    await db.execute(quizsetQuizInsertQuery, quizsetQuizValues);

    return { id: quizData.id, ...quizData };
  } catch (error) {
    console.error("Error inserting quiz and quizset relation:", error);
    throw new Error("Database insert failed");
  }
}

export async function deleteSingleQuizFromDB(quizSetId, quizId) {
  const db = await createConnection();

  try {
    const deleteQuizQuery = `
      DELETE FROM quizzes
      WHERE id = ?
    `;
    await db.execute(deleteQuizQuery, [quizId]);

    return { success: true };
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw new Error("Failed to delete quiz.");
  }
}


export async function updateQSPublishState(quizsetId) {
  try {
    const db = await createConnection();

    const updateQuery = `
      UPDATE quizsets
      SET status = CASE 
                    WHEN status = 1 THEN 0
                    WHEN status = 0 THEN 1
                  END
      WHERE id = ?
    `;
    
    // Execute the update query
    const [updateResult] = await db.execute(updateQuery, [quizsetId]);

    // If no rows were affected, that means the quizset ID was not found
    if (updateResult.affectedRows === 0) {
      throw new Error("Quizset not found or already in the desired state.");
    }

    // Fetch the updated state to confirm the change
    const [rows] = await db.execute("SELECT status FROM quizsets WHERE id = ?", [quizsetId]);
    
    // If no rows are returned, it means the quizset was not found
    if (!rows.length) {
      throw new Error("Failed to fetch updated quizset.");
    }

    // Return the updated status
    return rows[0].status;

  } catch (error) {
    console.error("Error updating quizset publish state:", error);
    throw new Error("Database update failed");
  }
}
