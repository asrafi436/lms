"use server";

import { v4 as uuidv4 } from "uuid";
import { updateModuleTitle, createModule } from "@/queries/modules";

export async function updateTitle(moduleId, newModule) {
  try {
    const success = await updateModuleTitle(moduleId, newModule);
    if (!success) {
      throw new Error("Failed to update course title");
    }
    return { success: true, message: "Course title updated successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}


export async function createCourseModule(data) {
    try {
        const newModule = {
            id: uuidv4().replace(/-/g, ""), // Convert UUID to 24-character string
            title: data.title,
            description: null,
            status: null,
            slug: null,
            course_id: null,
            duration: null
        };

        const module = await create(newModule);
        return module;
    } catch (e) {
        console.error("module creation failed:", e);
        throw new Error("Failed to create module.");
    }
}