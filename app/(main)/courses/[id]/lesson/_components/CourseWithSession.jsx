// app/(main)/courses/[id]/lesson/_components/CourseWithSession.jsx

"use client"; // Ensure this is a client-side component

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import VideoDescription from "./video-description"; // Ensure the path is correct
import { LessonVideo } from "./lesson-video"; // Ensure the path is correct

const CourseWithSession = ({ lesson, id, moduleId, lessonId }) => {
  const { data: session } = useSession(); // Get the session data

  const userId = session?.user?.id;

  return (
    <div>
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4 w-full">
          <LessonVideo courseId={id} lesson={lesson} moduleId={moduleId} />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{lesson.title}</h2>
            <Button size="lg">Watch Complete</Button>
          </div>
          <Separator />
          <VideoDescription description={lesson.description} />
        </div>
      </div>
    </div>
  );
};

export default CourseWithSession;
