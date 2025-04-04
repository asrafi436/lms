// E:\Business Automation\3. Final Project\project - mysql\lms\app\action\course.js

"use server";

import { v4 as uuidv4 } from "uuid";  // Import UUID
import { getLoggedInUser } from "@/lib/loggedin-user";
import { create, updateCourseTitle, updateCourseDescription, updateCourseSubtitle, updateCoursePrice,  updateeCourseCategories } from "@/queries/courses";

export async function createCourse(data) {
    try {
        const loggedinUser = await getLoggedInUser();
        const newCourse = {
            id: uuidv4().replace(/-/g, ""), // Convert UUID to 24-character string
            title: data.title,
            description: data.description,
            thumbnail: null,
            price: 0,
            active: 0,
            category_id: null,
            quizset_id: null,
            subtitle: null,
            learning: null,
            instructor_id: loggedinUser?.id, // Assign instructor
            created_on: new Date(), // Add timestamps
            modified_on: new Date(),
        };

        const course = await create(newCourse);
        return course;
    } catch (e) {
        console.error("Course creation failed:", e);
        throw new Error("Failed to create course.");
    }
}


export async function updateTitle(courseId, newTitle) {
    try {
        const success = await updateCourseTitle(courseId, newTitle);
        if (!success) {
            throw new Error("Failed to update course title");
        }
        return { success: true, message: "Course title updated successfully" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export async function updateSubtitle(courseId, newSubtitle) {
    try {
        const success = await updateCourseSubtitle(courseId, newSubtitle);
        if (!success) {
            throw new Error("Failed to update course title");
        }
        return { success: true, message: "Course title updated successfully" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export async function updateDescription(courseId, newDescription) {
    try {
        const success = await updateCourseDescription(courseId, newDescription);
        if (!success) {
            throw new Error("Failed to update course description");
        }
        return { success: true, message: "Course description updated successfully" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export async function updatePrice(courseId, newPrice) {
    try {
        const success = await updateCoursePrice(courseId, newPrice);
        if (!success) {
            throw new Error("Failed to update course newPrice");
        }
        return { success: true, message: "Course Price updated successfully" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export async function updateCategoy(courseId, categoryData) {
    try {
      const success = await updateeCourseCategories(courseId, categoryData.category);
      if (!success) {
        throw new Error("Failed to update course category_id");
      }
      return { success: true, message: "Course category updated successfully" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }





