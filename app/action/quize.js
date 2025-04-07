


"use server"
 import { updateQSTitles } from "@/queries/quizzes-modelq";
 import { createQuizWithQuizset, deleteSingleQuizFromDB, updateQSPublishState,
  createQuizSet,deleteQuizset } from "@/queries/quizzes-modelq";
 import { v4 as uuidv4 } from "uuid";
 import { getLoggedInUser } from "@/lib/loggedin-user";

 
 
 export async function updateQSTitle(quizset, dataToUpdate) {
    try {
      const result = await updateQSTitles(quizset, dataToUpdate);
      
      // Fix serialization issue for Client Components
      return JSON.parse(JSON.stringify(result));
    } catch (error) {
      console.error("Failed to update quiz set title:", error);
      throw error;
    }
  }
  

export async function createQuizSetAction(data) {
    try {
      const loggedinUser = await getLoggedInUser();
  
      const newQuizSet = {
        id: data.id,
        title: data.title,
        instructor_id: loggedinUser?.id, // Set instructor_id from logged-in user
      };
  
      const quizSet = await createQuizSet(newQuizSet);
      return quizSet;
    } catch (error) {
      console.error("Quiz set creation failed:", error);
      throw new Error("Failed to create quiz set.");
    }
  }


  
  export async function deleteQuizsetById(quizsetId) {
    try {
      const res = await deleteQuizset(quizsetId);
      return res;
    } catch (err) {
      throw new Error(err);
    }
  }
  
 

export async function createQuiz(data, quizSetId) {
  try {
    const quizId = uuidv4().replace(/-/g, "").slice(0, 24); // Generate 24-char quiz ID

    const quizPayload = {
      id: quizId,
      question: data.title,
      description: data.description,
      explanations: data.explanations || "",
      mark: 5,
      slug: data.title.toLowerCase().replace(/\s+/g, "-"),
      option1_text: data.optionA.label,
      option1_is_correct: data.optionA.isTrue ? 1 : 0,
      option2_text: data.optionB.label,
      option2_is_correct: data.optionB.isTrue ? 1 : 0,
      option3_text: data.optionC.label,
      option3_is_correct: data.optionC.isTrue ? 1 : 0,
      option4_text: data.optionD.label,
      option4_is_correct: data.optionD.isTrue ? 1 : 0,
      quizset_id: quizSetId
    };

    const quiz = await createQuizWithQuizset(quizPayload);
    return quiz;
  } catch (error) {
    console.error("Failed to create quiz:", error);
    throw new Error("Quiz creation failed."); // this is what toast sees
  }
}


export async function deleteSingleQuiz(quizSetId, quizId) {
  try {
    const quiz = await deleteSingleQuizFromDB(quizSetId, quizId);
    return quiz;
  } catch (error) {
    console.error("Failed to delete quiz:", error);
    throw new Error("Quiz deletion failed."); // this is what toast sees
  }
}

export async function changeQuizPublishState(quizSetId) {
  try {
    const quiz = await updateQSPublishState(quizSetId);
    return quiz;
  } catch (error) {
    console.error("Failed to change quiz publish state:", error);
    throw new Error("Publish state change failed."); // this is what toast sees
  }
}


  