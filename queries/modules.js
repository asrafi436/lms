"use server";

import { createConnection } from "@/lib/db";

export async function getCourseModules(courseId) {
  try {
    if (!courseId) {
      throw new Error("Course ID is required");
    }

    // Establish database connection
    const db = await createConnection();

    // Query only existing fields
    const query = `
      SELECT 
        modules.id,
        modules.title,
        modules.slug,
        modules.description,
        modules.status,
        modules.duration,
        modules.order
      FROM modules
      WHERE modules.course_id = ?
    `;

    const values = [courseId];
    const [modules] = await db.execute(query, values);

    if (!modules || modules.length === 0) {
      console.warn("No modules found for course with ID:", courseId);
      return {
        courseId,
        modules: [],
        count: 0
      };
    }

    return {
      courseId,
      modules,
      count: modules.length
    };
  } catch (error) {
    console.error("Error fetching course modules:", error);
    throw new Error("Failed to fetch course modules.");
  }
}

export async function getModuleById(moduleId) {
  try {
    if (!moduleId) {
      throw new Error("Module ID is required");
    }

    const db = await createConnection();

    const query = `
      SELECT 
        id,
        course_id,
        title,
        slug,
        description,
        status,
        duration,
        \`order\`
      FROM modules
      WHERE id = ?
      LIMIT 1
    `;

    const [rows] = await db.execute(query, [moduleId]);

    if (!rows || rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error("Error fetching module by ID:", error);
    throw new Error("Failed to fetch module.");
  }
}

export async function updateModuleTitle(moduleId, newModule) {
  try {
    const db = await createConnection()
    const query = `
            UPDATE modules
            SET title = ?
            WHERE id = ?
        `;

    const values = [newModule, moduleId];

    const [result] = await db.execute(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating course title:", error);
    throw new Error("Database update failed");
  }
}



export async function createModule(moduleData) {
  try {
    const db = await createConnection();

    const query = `
      INSERT INTO modules (id, title, course_id, \`order\`) 
      VALUES (?, ?, ?, ?)
    `;
    const values = [
      moduleData.id,
      moduleData.title,
      moduleData.course_id,
      moduleData.order,
    ];

    console.log("Executing SQL Query:", query.trim(), values);

    const [result] = await db.execute(query, values);
    console.log("SQL Query Result:", result);

    return { id: moduleData.id, ...moduleData };
  } catch (error) {
    console.error("Error inserting module:", error);
    throw new Error("Module insert failed");
  }
}





export async function updateOrder(moduleId, newOrder) {
  const db = await createConnection();  // Create a new connection

  try {
    await db.beginTransaction();  // Start the transaction

    const query = `UPDATE modules SET \`order\` = ? WHERE id = ?`;
    const values = [newOrder, moduleId];
    await db.execute(query, values);  // Execute the update for the specific module

    await db.commit();  // Commit the transaction
  } catch (e) {
    console.error("Reordering modules failed:", e);
    await db.rollback();  // Rollback the transaction in case of error
    throw new Error("Failed to reorder modules");
  }
}








