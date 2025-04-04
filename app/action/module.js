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


export async function createCourseModule(courseId, data) {
    try {
        if (!courseId) {
            console.error("Error: courseId is undefined");
            throw new Error("Course ID is required to create a module.");
        }

        // Generate the unique ID for the new module
        const newModuleId = uuidv4().replace(/-/g, ""); // Unique ID without hyphens

        console.log("Generated new module ID:", newModuleId); // Log the generated ID

        const newModule = {
            id: newModuleId,  // Use the generated ID here
            title: data.title,
            course_id: courseId,
        };

        const module = await createModule(newModule);
        console.log("Module created successfully:", module);

        return module;
    } catch (e) {
        console.error("Module creation failed:", e.message || e); // Log the full error message
        throw new Error("Failed to create module.");
    }
}


export async function reOrderModules(data){

    try {
        await Promise.all(data.map(async(element) => {
            await Module.findByIdAndUpdate(element.id, {order: element.position});
        }));
    } catch (e) {
        throw new Error(e);
    }

}