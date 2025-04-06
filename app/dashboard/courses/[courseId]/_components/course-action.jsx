// components/course-action.js

"use client";

import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { changeCoursePublishState, deleteCourse } from "@/app/action/course";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const CourseActions = ({ courseId, isActive }) => {
  const [published, setPublished] = useState(isActive);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePublishChange = async () => {
    setLoading(true);
    try {
      const newState = published === 1 ? 0 : 1;
      const updatedState = await changeCoursePublishState(courseId, newState);
      setPublished(updatedState);
      toast.success(`Course ${newState === 1 ? "published" : "unpublished"}`);
    } catch (e) {
      toast.error(e.message || "Failed to change course publish state");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteCourse(courseId);
      toast.success("Course deleted");
      router.push("/dashboard/courses"); // Redirect after deletion
    } catch (e) {
      toast.error(e.message || "Failed to delete course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePublishChange}
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
