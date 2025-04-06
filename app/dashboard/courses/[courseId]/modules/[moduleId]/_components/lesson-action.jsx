"use client";

import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { changePublishState, deleteLesson } from "@/app/action/lesson";
import { useRouter } from "next/navigation";

export const LessonActions = ({ lesson, courseId, moduleId, onDelete }) => {
  const [published, setPublished] = useState(lesson?.published); // assumes 0 or 1 from DB
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChangePublish = async () => {
    setLoading(true);
    try {
      const newState = await changePublishState(lesson.id, published === 1 ? 0 : 1);
      setPublished(newState); // newState is 0 or 1 from DB
      toast.success(`Lesson ${newState === 1 ? "published" : "unpublished"}`);
    } catch (e) {
      toast.error(e.message || "Failed to change publish state");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (published === 1) {
      toast.error("Unpublish the lesson before deleting.");
      return;
    }

    setLoading(true);
    try {
      await deleteLesson(lesson.id);
      toast.success("Lesson deleted");

      // Close the modal after deletion
      if (onDelete) {
        onDelete();  // Close modal (trigger parent callback)
      }

      // After deletion, refresh the page (using router.replace to avoid history stack)
      router.replace(`/dashboard/courses/${courseId}/modules/${moduleId}`);
    } catch (e) {
      toast.error(e.message || "Failed to delete lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleChangePublish}
        disabled={loading}
      >
        {published === 1 ? "Unpublish" : "Publish"}
      </Button>

      <Button
        size="sm"
        onClick={handleDelete}
        disabled={loading}
        variant="destructive"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
