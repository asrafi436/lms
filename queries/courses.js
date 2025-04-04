// queries\courses.js

import { createConnection } from "@/lib/db";


export async function getCategories() {
  try {
    const db = await createConnection();
    const query = `SELECT * FROM categories`;

    const [categories] = await db.execute(query); // Extract rows (actual data)

    if (!categories || categories.length === 0) {
      console.error("No categories found", categories);
      return []; // Return an empty array instead of null
    }

    return categories; // This now correctly returns all rows from 'categories'
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories.");
  }
}



export async function getCourseDetails(courseId) {
  try {
    if (!courseId) {
      throw new Error("Course ID is required");
    }

    const db = await createConnection();

    const query = `
                        SELECT 
                        courses.*, 
                        categories.title AS category_title
                        FROM courses
                        LEFT JOIN categories ON courses.category_id = categories.id
                        WHERE courses.id = ?
                        LIMIT 1;

                    `;

    const values = [courseId];
    const [courses] = await db.execute(query, values);

    if (!courses || courses.length === 0) {
      console.error("No course found with ID:", courseId);
      return null;
    }

    return courses[0]; // This now includes category_title
  } catch (error) {
    console.error("Error fetching course details:", error);
    throw new Error("Failed to fetch course details.");
  }
}



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


export async function updateCourseTitle(courseId, newTitle) {
  try {
    const db = await createConnection()
    const query = `
            UPDATE courses
            SET title = ?, modified_on = NOW()
            WHERE id = ?
        `;

    const values = [newTitle, courseId];

    const [result] = await db.execute(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating course title:", error);
    throw new Error("Database update failed");
  }
}

export async function updateCourseSubtitle(courseId, newSubtitle) {
  try {
    const db = await createConnection()
    const query = `
            UPDATE courses
            SET subtitle = ?, modified_on = NOW()
            WHERE id = ?
        `;

    const values = [newSubtitle, courseId];

    const [result] = await db.execute(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating course subtitle:", error);
    throw new Error("Database update failed");
  }
}

export async function updateCourseDescription(courseId, description) {
  try {
    const db = await createConnection();
    const query = `
        UPDATE courses
        SET description = ?, modified_on = NOW()
        WHERE id = ?
      `;
    const values = [description, courseId];

    const [result] = await db.execute(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating course description:", error);
    throw new Error("Database update failed");
  }
}

export async function updateCoursePrice(courseId, price) {
  try {
    const db = await createConnection();
    const query = `
        UPDATE courses
        SET price = ?, modified_on = NOW()
        WHERE id = ?
      `;
    const values = [price, courseId];

    const [result] = await db.execute(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating course price:", error);
    throw new Error("Database update failed");
  }
}


export async function updateeCourseCategories(courseId, category_id) {
  try {
    const db = await createConnection();
    const query = `
        UPDATE courses
        SET category_id = ?, modified_on = NOW()
        WHERE id = ?
      `;
    const values = [category_id || null, courseId]; // handle null

    const [result] = await db.execute(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating course category:", error);
    throw new Error("Database update failed");
  }
}


export async function updateCourseThumbnail(courseId, thumbnail) {
  try {
    const db = await createConnection();
    const query = `
        UPDATE courses
        SET thumbnail = ?, modified_on = NOW()
        WHERE id = ?
      `;
    const values = [thumbnail, courseId];

    const [result] = await db.execute(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating course thumbnail:", error);
    throw new Error("Database update failed");
  }
}

