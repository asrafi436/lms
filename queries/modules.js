import { createConnection } from "@/lib/db";



export async function create(courseData) {
  try {
    const db = await createConnection(); // Ensure you get a DB connection

                        const query = `
                        INSERT INTO courses (
                        id, title, description, thumbnail, price, active, 
                        category_id, instructor_id, quizset_id, subtitle, learning, 
                        created_on, modified_on
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `;

    const values = [
      courseData.id,
      courseData.title,
      courseData.description,
      courseData.thumbnail,
      courseData.price,
      courseData.active,
      courseData.category_id,
      courseData.instructor_id,
      courseData.quizset_id,
      courseData.subtitle,
      courseData.learning,
      new Date().toISOString().slice(0, 19).replace("T", " "), // created_on
      new Date().toISOString().slice(0, 19).replace("T", " ")  // modified_on
    ];

    const [result] = await db.execute(query, values);
    return { id: courseData.id, ...courseData }; // Return inserted course
  } catch (error) {
    console.error("Error inserting course:", error);
    throw new Error("Database insert failed");
  }
}