"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import QuizModal from "./quiz-modal";

const Quiz = ({ quizDataByCourse }) => {
  const [open, setOpen] = useState(false);

  // Group questions by quizset_id
  const groupedQuizData = quizDataByCourse.reduce((acc, item) => {
    const existing = acc.find(q => q.id === item.quizset_id);
    const question = {
      id: item.question_id,
      question: item.question,
      description: item.description,
      slug: item.slug,
      options: [
        {
          label: item.option1_text,
          id: 1,
          isCorrect: item.option1_is_correct === 1,
        },
        {
          label: item.option2_text,
          id: 2,
          isCorrect: item.option2_is_correct === 1,
        },
        {
          label: item.option3_text,
          id: 3,
          isCorrect: item.option3_is_correct === 1,
        },
        {
          label: item.option4_text,
          id: 4,
          isCorrect: item.option4_is_correct === 1,
        },
      ],
    };

    if (existing) {
      existing.questions.push(question);
    } else {
      acc.push({
        id: item.quizset_id,
        title: item.quizset_title,
        slug: item.slug,
        questions: [question],
      });
    }

    return acc;
  }, []);

  return (
    <>
      {groupedQuizData.map((quiz, i) => (
        <div key={i} className="max-w-[270px] bg-white border border-border rounded-md dark:bg-gray-800 dark:border-gray-700 overflow-hidden mb-4">
          <div className="flex h-32 items-center justify-center bg-gradient-to-r from-sky-500 to-indigo-500 px-6 text-center">
            <span className="text-lg font-semibold text-white">
              Quiz: {quiz.title}
            </span>
          </div>
          <div className="p-4">
            <Button
              className="flex gap-2 capitalize border-sky-500 text-black hover:text-sky-500 hover:bg-sky-500/5 w-full"
              variant="outline"
              onClick={() => setOpen(true)}
            >
              Participate in Quiz
            </Button>
          </div>

          {/* Modal for the quiz */}
          <QuizModal quizes={[quiz]} open={open} setOpen={setOpen} />
        </div>
      ))}
    </>
  );
};

export default Quiz;
