"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";

function QuizModal({ quizes, open, setOpen }) {
  const [quizIndex, setQuizIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuiz = quizes?.[quizIndex];
  const totalQuestions = currentQuiz?.questions.length || 0;
  const currentQuestion = currentQuiz?.questions?.[questionIndex];

  const handleOptionChange = (optionId) => {
    const key = `${quizIndex}-${questionIndex}`;
    setSelectedAnswers({ ...selectedAnswers, [key]: optionId });
  };

  const handlePrev = () => {
    if (questionIndex > 0) {
      setQuestionIndex((prev) => prev - 1);
    } else if (quizIndex > 0) {
      const prevQuiz = quizes[quizIndex - 1];
      setQuizIndex((prev) => prev - 1);
      setQuestionIndex(prevQuiz.questions.length - 1);
    }
  };

  const handleNext = () => {
    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex((prev) => prev + 1);
    } else if (quizIndex < quizes.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setQuestionIndex(0);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;

    quizes.forEach((quiz, qIdx) => {
      quiz.questions.forEach((question, quesIdx) => {
        const key = `${qIdx}-${quesIdx}`;
        const selectedId = selectedAnswers[key];
        const correctOption = question.options.find((opt) => opt.isCorrect);

        if (correctOption && correctOption.id === selectedId) {
          correctCount += 1;
        }
      });
    });

    setScore(correctCount * 5); // 5 mark per correct
    setSubmitted(true);
  };

  const selectedOption = selectedAnswers[`${quizIndex}-${questionIndex}`];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[95%] block bg-white">
        <DialogTitle className="sr-only">Quiz</DialogTitle>

        {submitted ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">🎉 Your Score: {score}</h2>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
        ) : (
          <>
            <div className="pb-4 border-b border-border text-sm">
              <span className="text-success inline-block mr-1">
                Quiz {quizIndex + 1} – Q{questionIndex + 1}/{totalQuestions}
              </span>
            </div>

            <div className="py-4">
              <h3 className="text-xl font-medium mb-6">{currentQuestion?.question}</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mb-6">
              {currentQuestion?.options.map((option) => (
                <div key={option.id}>
                  <input
                    className="peer hidden"
                    type="radio"
                    id={`option-${option.id}`}
                    name={`question-${quizIndex}-${questionIndex}`}
                    checked={selectedOption === option.id}
                    onChange={() => handleOptionChange(option.id)}
                  />
                  <Label
                    htmlFor={`option-${option.id}`}
                    className="border border-border rounded px-2 py-3 block cursor-pointer 
                                transition-all font-normal 
                                  peer-checked:bg-green-100 peer-checked:border-green-500 peer-checked:text-green-700 
                                          hover:bg-gray-50"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>

            <DialogFooter className="flex flex-col gap-4 sm:flex-row sm:justify-between">
              <Button
                className="gap-2 rounded-3xl"
                disabled={quizIndex === 0 && questionIndex === 0}
                onClick={handlePrev}
              >
                <ArrowLeft /> Previous
              </Button>

              {quizIndex === quizes.length - 1 && questionIndex === totalQuestions - 1 ? (
                <Button className="gap-2 rounded-3xl" onClick={handleSubmit}>
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  className="gap-2 rounded-3xl"
                  onClick={handleNext}
                  disabled={selectedOption === undefined}
                >
                  Next <ArrowRight />
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default QuizModal;
