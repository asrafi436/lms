"use server";

import { createConnection } from "@/lib/db";

// Fetch all lessons for a specific module
export async function getModuleLessons(moduleId) {
  try {
    if (!moduleId) {
      throw new Error("Module ID is required");
    }

    // Establish database connection
    const db = await createConnection();

    // Query lessons related to the module
    const query = `
      SELECT 
        lessons.id,
        lessons.title,
        lessons.description,
        lessons.duration,
        lessons.video_url,
        lessons.published,
        lessons.slug,
        lessons.access,
        lessons.module_id
      FROM lessons
      WHERE lessons.module_id = ?
    `;

    const values = [moduleId];
    const [lessons] = await db.execute(query, values);

    if (!lessons || lessons.length === 0) {
      console.warn("No lessons found for module with ID:", moduleId);
      return {
        moduleId,
        lessons: [],
        count: 0
      };
    }

    return {
      moduleId,
      lessons,
      count: lessons.length
    };
  } catch (error) {
    console.error("Error fetching module lessons:", error);
    throw new Error("Failed to fetch lessons.");
  }
}

// Fetch lesson by module ID
export async function getLessonById(moduleId) {
  try {
    if (!moduleId) {
      throw new Error("Module ID is required");
    }

    const db = await createConnection();

    const query = `
      SELECT 
        *
      FROM lessons
      WHERE module_id = ?
    `;

    const [rows] = await db.execute(query, [moduleId]);

    if (!rows || rows.length === 0) {
      return null;
    }

    return rows;  // Return an array of lessons, not just the first one
  } catch (error) {
    console.error("Error fetching lessons by Module ID:", error);
    throw new Error("Failed to fetch lessons.");
  }
}


export async function getLessonByLessonId(lessonId) {
  try {
    if (!lessonId) {
      throw new Error("Lesson ID is required");
    }

    const db = await createConnection();

    const query = `SELECT id, title, description, duration, video_url, published, slug, access, module_id, \`order\` FROM lessons WHERE id = ?`;

    const [rows] = await db.execute(query, [lessonId]);

    if (!rows || rows.length === 0) {
      return null;
    }

    return rows[0]; // Return the single lesson
  } catch (error) {
    console.error("Error fetching lesson by ID:", error);
    throw new Error("Failed to fetch lesson.");
  }
}



// Create a new lesson
export async function createLesson(lessonData) {
  try {
    const db = await createConnection();

    // SQL query to insert lesson data into the 'lessons' table
    const query = `
      INSERT INTO lessons (id, title, module_id, \`order\`) 
      VALUES (?, ?, ?, ?)
    `;

    const values = [
      lessonData.id,
      lessonData.title,
      lessonData.module_id,
      lessonData.order, 
    ];

    console.log("Executing SQL Query:", query.trim(), values);

    const [result] = await db.execute(query, values);
    console.log("SQL Query Result:", result);

    // If id is auto-generated, we retrieve it from the result
    // const insertedId = result.insertId || lessonData.id;

    // Return the lesson data, including the generated or provided id
    return { id: lessonData.id, ...lessonData };
  } catch (error) {
    console.error("Error inserting lesson:", error);
    throw new Error("Lesson insert failed");
  }
}



// Update the order of lessons within a module
export async function updateLessonOrder(lessonId, newOrder) {
  const db = await createConnection();  // Create a new connection

  try {
    await db.beginTransaction();  // Start the transaction

    const query = `UPDATE lessons SET \`order\` = ? WHERE id = ?`;
    const values = [newOrder, lessonId];
    await db.execute(query, values);  // Execute the update for the specific lesson

    await db.commit();  // Commit the transaction
  } catch (e) {
    console.error("Reordering lessons failed:", e);
    await db.rollback();  // Rollback the transaction in case of error
    throw new Error("Failed to reorder lessons");
  }
}

// Update lesson title
// Update lesson title
export async function updateLessonTitle(lessonId, newTitle) {
  try {
    const db = await createConnection();
    const query = `
      UPDATE lessons
      SET title = ?
      WHERE id = ?
    `;

    const values = [newTitle, lessonId];

    const [result] = await db.execute(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating lesson title:", error);
    throw new Error("Database update failed");
  }
}

export async function updateLessonDescription(lessonId, newDescription) {
  try {
    const db = await createConnection();
    const query = `
      UPDATE lessons
      SET description = ?
      WHERE id = ?
    `;

    const values = [newDescription, lessonId];

    const [result] = await db.execute(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating lesson newDescription:", error);
    throw new Error("Database update failed");
  }
}


// Function to update access
export async function updateLessonAccess(lessonId, newAccess) {
  try {
    const db = await createConnection();
    const query = `
      UPDATE lessons
      SET access = ?
      WHERE id = ?
    `;
    const values = [newAccess, lessonId];

    const [result] = await db.execute(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating lesson access:", error);
    throw new Error("Database update failed");
  }
}

// Function to update video URL and duration in the database
export async function updateLessonVideoUrlAndDuration(lessonId, newVideoUrl, newDuration) {
  try {
    const db = await createConnection();
    
    // SQL query to update both video URL and duration
    const query = `
      UPDATE lessons
      SET video_url = ?, duration = ?
      WHERE id = ?
    `;
    
    const values = [newVideoUrl, newDuration, lessonId];

    const [result] = await db.execute(query, values);
    
    // Return whether the update was successful (affected rows > 0)
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating lesson video URL and duration:", error);
    throw new Error("Database update failed");
  }
}




