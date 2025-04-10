"use server";

import { v4 as uuidv4 } from "uuid";
import {
  updateLessonTitle, createLesson, updateLessonOrder, updateLessonDescription,
  updateLessonAccess, updateLessonVideoUrlAndDuration, getLessonByLessonId, changeLessonPublishState, deleteLessons
} from "@/queries/lessons";
import { createLessonProgress, checkLessonProgressExists } from "@/queries/lessonProgress";


// Update the title of a lesson


// Create a new lesson under a module
export async function createModuleLesson(moduleId, data) {
  try {
    if (!moduleId) {
      throw new Error("Module ID is required to create a lesson.");
    }

    // Validate required data fields
    if (!data || !data.title || !data.order) {
      throw new Error("Lesson title and order are required.");
    }

    // Generate a new lesson ID
    const newLessonId = uuidv4().replace(/-/g, "");

    // Prepare the new lesson data
    const newLesson = {
      id: newLessonId,
      title: data.title,
      module_id: moduleId,
      order: data.order, // Ensure 'order' is being passed properly
    };

    // Create the lesson in the database
    const lesson = await createLesson(newLesson);
    return lesson;
  } catch (e) {
    console.error("Lesson creation failed:", e.message || e);
    throw new Error("Failed to create lesson.");
  }
}

// Reorder lessons within a module
export async function reOrderLessons(data) {
  try {
    for (const element of data) {
      // Await each updateLessonOrder call to ensure they complete before proceeding
      await updateLessonOrder(element.id, element.position);
    }
  } catch (e) {
    // Handle errors by throwing a new error
    throw new Error(`Failed to reorder lessons: ${e.message}`);
  }
}


export async function updateTitle(lessonId, newlesson) {
  try {
    const success = await updateLessonTitle(lessonId, newlesson);
    if (!success) {
      throw new Error("Failed to update course title");
    }
    return { success: true, message: "Course title updated successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updateDescription(lessonId, newDescription) {
  try {
    const success = await updateLessonDescription(lessonId, newDescription);
    if (!success) {
      throw new Error("Failed to update coursedescription");
    }
    return { success: true, message: "Course description updated successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Wrapper functions for lesson access and video URL updates
export async function updateAccess(lessonId, newAccess) {
  try {
    const success = await updateLessonAccess(lessonId, newAccess);
    if (!success) {
      throw new Error("Failed to update lesson access");
    }
    return { success: true, message: "Lesson access updated successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updateVideoUrl(lessonId, newVideoUrl, newDuration) {
  try {
    // Call the function to update the video URL and duration in the database
    const success = await updateLessonVideoUrlAndDuration(lessonId, newVideoUrl, newDuration);

    if (!success) {
      throw new Error("Failed to update lesson video URL and duration");
    }

    return { success: true, message: "Lesson video URL and duration updated successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}


// actions/lesson.js
export async function changePublishState(lessonId, newPublishedState) {
  try {
    const actualState = await changeLessonPublishState(lessonId, newPublishedState);
    return actualState;
  } catch (error) {
    console.error("Error changing publish state:", error);
    throw new Error(error.message || "Failed to change publish state");
  }
}


export async function deleteLesson(lessonId) {
  try {
    const res = await deleteLessons(lessonId);

  } catch (err) {
    throw new Error(err);
  }
}



export async function markLessonComplete({ userId, lessonId, courseId }) {
  if (!userId || !lessonId || !courseId) {
    throw new Error("Missing required data");
  }

  try {
    const result = await createLessonProgress({
      user_id: userId,
      lesson_id: lessonId,
      course_id: courseId
    });

    return result;
  } catch (error) {
    console.error("Failed to mark lesson complete:", error);
    throw error;
  }
}


export async function checkLessonProgressExist(userId, id, lessonId) {
  return await checkLessonProgressExists({ userId, id, lessonId });
}


