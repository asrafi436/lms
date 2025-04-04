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
        modules.duration
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
      INSERT INTO modules (id, title, course_id) 
      VALUES (?, ?, ?)
    `;
    const values = [
      moduleData.id,
      moduleData.title,
      moduleData.course_id,
    ];

    console.log("Executing SQL Query:", query, values); // Log the query and values

    const [result] = await db.execute(query, values);
    console.log("SQL Query Result:", result); // Log the result to check if it succeeded

    return { id: moduleData.id, ...moduleData };
  } catch (error) {
    console.error("Error inserting module:", error);
    throw new Error("Module insert failed");
  }
}
