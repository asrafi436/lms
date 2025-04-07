"use client";

import { Trash } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { changeQuizPublishState, deleteQuizsetById } from "@/app/action/quize";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const QuizSetAction = ({ quizSetId, quizeSetStatus }) => {
  const [action, setAction] = useState(null);
  const [published, setPublished] = useState(quizeSetStatus);
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      switch (action) {
        case "change-active": {
          const activeState = await changeQuizPublishState(quizSetId);
          setPublished(activeState);
          toast.success(activeState ? "The quiz has been published" : "The quiz has been unpublished");
          router.refresh();
          break;
        }

        case "delete": {
          if (published) {
            toast.error("A published quiz cannot be deleted. First unpublish it, then delete.");
          } else {
            await deleteQuizsetById(quizSetId);
            toast.success("Quiz has been deleted");
            router.push("/dashboard/quiz-sets");
          }
          break;
        }

        default: {
          throw new Error("Invalid action selected.");
        }
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-x-2">
        <Button
          variant="outline"
          size="sm"
          type="submit"
          onClick={() => setAction("change-active")}
        >
          {published ? "Unpublish" : "Publish"}
        </Button>

        <Button
          variant="destructive"
          size="sm"
          type="submit"
          onClick={() => setAction("delete")}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
