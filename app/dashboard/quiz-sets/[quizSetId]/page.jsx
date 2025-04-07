"use client";
import { useEffect, useState } from "react";
import AlertBanner from "@/components/alert-banner";
import { IconBadge } from "@/components/icon-badge";
import { LayoutDashboard, Pencil, Delete, Trash, CircleCheck, Circle } from "lucide-react";
import { QuizSetAction } from "./_components/quiz-set-action";
import { TitleForm } from "./_components/title-form";
import { AddQuizForm } from "./_components/add-quiz-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getQuizsetWithQuizzesById } from "@/app/action/combainQuizset";
import { useParams } from "next/navigation";
import { QuizCardActions } from "./_components/quiz-card-action";

const EditQuizSet = () => {
  const { quizSetId } = useParams();

  const [quizes, setQuizes] = useState([]); // Start with an empty array
  const [quizeSet, setQuizeSet] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getQuizsetWithQuizzesById(quizSetId);
        console.log("Fetched quiz set:", result);  // Check the result structure

        // Safely update quizzes after transformation
        if (result?.quizzes) {
          const transformedQuizzes = result.quizzes.map((quiz) => {
            return {
              id: quiz.id.toString(),
              title: quiz.question, // Assuming question is the title
              options: Object.values(quiz.options).map(option => ({
                label: option.text,
                isTrue: option.is_correct
              }))
            };
          });
          setQuizes(transformedQuizzes);
          setQuizeSet(result)  // Update the state with transformed quizzes
        }
      } catch (err) {
        console.error("Failed to fetch quizset with quizzes:", err);
      }
    };

    fetchData();
  }, [quizSetId]);

  return (
    <>
      <AlertBanner
        label="This course is unpublished. It will not be visible in the course."
        variant="warning"
      />
      <div className="p-6">
        <div className="flex items-center justify-end">
          <QuizSetAction />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-16">
          {/* Quiz List */}
          <div className="max-lg:order-2">
            <h2 className="text-xl mb-6">Quiz List</h2>
            <AlertBanner
              label="No Quiz are in the set, add some using the form above."
              variant="warning"
              className="rounded mb-6"
            />
            <div className="space-y-6">
              {quizes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-gray-50 shadow-md p-4 lg:p-6 rounded-md border"
                >
                  <h2 className="mb-3">{quiz.title}</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quiz.options.map((option) => (
                      <div
                        className={cn(
                          "py-1.5 rounded-sm text-sm flex items-center gap-1 text-gray-600"
                        )}
                        key={option.label}
                      >
                        {option.isTrue ? (
                          <CircleCheck className="size-4 text-emerald-500" />
                        ) : (
                          <Circle className="size-4" />
                        )}
                        <p>{option.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-6">
                  <QuizCardActions quiz={quiz} quizSetId={quizSetId} /> 
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Right Side Panel */}
          <div>
            <div className="flex items-center gap-x-2">
              <h2 className="text-xl">Customize your quiz set</h2>
            </div>
            <div className="max-w-[800px]">
              <TitleForm
                 initialData={{ title: quizeSet.title  }} quizSetId={quizSetId}
              />
            </div>

            <div className="max-w-[800px]">
              <AddQuizForm setQuizes={setQuizes} quizSetId={quizSetId}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditQuizSet;
