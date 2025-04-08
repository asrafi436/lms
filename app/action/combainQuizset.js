"use server";

import { auth } from "@/auth";
import { getUserByEmail } from "@/queries/users"; // example path

import { getQuizSets } from "@/queries/quizset-modelq";
import { getQuizsetQuizzes } from "@/queries/quizsetQuizs";
import { getQuizzes } from "@/queries/quizzes-modelq"; 

// This combines quiz sets with quizset_quizzes table (just quiz IDs in each set)
export async function getCombinedQuizsets() {
  try {
    const session = await auth();

  // Redirect if not logged in
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch full user from DB by email
  const loggedInUser = await getUserByEmail(session.user.email);

  if (!loggedInUser) {
    console.error("User not found in MySQL");
    redirect("/login");
  }

    const quizSets = await getQuizSets(loggedInUser?.id);
    const quizsetQuizzes = await getQuizsetQuizzes();

    const combinedData = quizSets.map((quizset) => {
      const quizzesForThisSet = quizsetQuizzes
        .filter((q) => q.quizset_id === quizset.id)
        .map((q) => q.quiz_id);

      return {
        ...quizset,
        quizzes: quizzesForThisSet,
      };
    });

    return combinedData;
  } catch (error) {
    console.error("Error combining quizsets:", error);
    return [];
  }
}

// This combines quiz sets with full quiz data (including options)
export async function getCombinedQuizsetsWithQuizzes() {
  try {
    const quizsets = await getCombinedQuizsets(); // Already includes quiz IDs
    const allQuizzes = await getQuizzes(); // Already includes nested options

    const combined = quizsets.map((set) => {
      const quizzesInSet = set.quizzes?.map((quizId) => {
        return allQuizzes.find((q) => q.id === quizId);
      }).filter(Boolean); // Removes any nulls (in case a quizId doesn't match)

      return {
        ...set,
        quizzes: quizzesInSet,
      };
    });

    return combined;
  } catch (error) {
    console.error("Error combining quizsets and quizzes:", error);
    throw new Error("Failed to combine quiz sets with quizzes.");
  }
}


export async function getQuizsetWithQuizzesById(quizsetId) {
    try {
      const quizsets = await getCombinedQuizsets(); // Already includes quiz IDs
      const allQuizzes = await getQuizzes(); // Includes full quiz details
  
      const targetSet = quizsets.find((set) => set.id === quizsetId);
  
      if (!targetSet) return null;
  
      const quizzesInSet = targetSet.quizzes?.map((quizId) => {
        return allQuizzes.find((q) => q.id === quizId);
      }).filter(Boolean);
  
      return {
        ...targetSet,
        quizzes: quizzesInSet,
      };
    } catch (error) {
      console.error("Error getting quizset by ID:", error);
      throw new Error("Failed to fetch quiz set with quizzes.");
    }
  }
  