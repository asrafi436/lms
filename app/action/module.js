"use server";

import { v4 as uuidv4 } from "uuid";
import { updateModuleTitle, createModule, updateOrder, removeModule, updateModulePublishState } from "@/queries/modules";

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
        throw new Error("Course ID is required to create a module.");
      }
  
      const newModuleId = uuidv4().replace(/-/g, "");
  
      const newModule = {
        id: newModuleId,
        title: data.title,
        course_id: courseId,
        order: data.order, // 👈 Make sure this is coming through
      };
  
      const module = await createModule(newModule);
      return module;
    } catch (e) {
      console.error("Module creation failed:", e.message || e);
      throw new Error("Failed to create module.");
    }
  }
  

  export async function reOrderModules(data) {
    try {
      for (const element of data) {
        // Await each updateOrder call to ensure they complete before proceeding
        await updateOrder(element.id, element.position);
      }
    } catch (e) {
      // Handle errors by throwing a new error
      throw new Error(`Failed to reorder modules: ${e.message}`);
    }
  }
  
  export async function changeModulePublishState(moduleId, newState) {
    try {
      const actualState = await updateModulePublishState(moduleId, newState);
      return actualState;
    } catch (error) {
      console.error("Error changing module publish state:", error);
      throw new Error(error.message || "Failed to change module publish state");
    }
  }
  
  export async function deleteModule(moduleId) {
    try {
      const res = await removeModule(moduleId);
      return res;
    } catch (err) {
      console.error("Error deleting module:", err);
      throw new Error("Failed to delete module");
    }
  }
  