'use client';

import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from 'react';




export const SidebarLessonItem = ({ lesson, isActive, courseId, userId}) => {
  const [state, setState] = useState(null);

  

  const lessonId = lesson.lesson_id;

  // Check if the lesson is private (adjusted for string comparison) or locked
  const isPrivate = (lesson) => lesson?.lesson_access === "0" || lesson?.lesson_access === null;

  // Check if the lesson is published
  const isPublished = (isActive) => isActive; // If isActive is true, the lesson is published

  useEffect(() => {
    const fetchLessonProgress = async () => {
      try {
        const res = await fetch('/api/lesson-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId, lessonId }),
        });

        if (!res.ok) throw new Error("Failed to fetch progress");

        const data = await res.json();
        setState(data.state); // 0, 1, or null
      } catch (err) {
        console.error('Failed to fetch lesson state:', err);
      }
    };

    fetchLessonProgress();
  }, [courseId, lessonId]);

  // Don't show unpublished lessons
  if (isPublished(isActive)) return null;

  // Determine the correct icon for the lesson
  const lessonIcon = () => {
    if (isPrivate(lesson)) return <Lock size={16} className="text-slate-700" />;
    if (state === 1) return <CheckCircle size={16} className="text-emerald-700" />;
    return <PlayCircle size={16} className="text-slate-700" />;
  };

  return (
    <Link
      href={
        isPrivate(lesson)
          ? "#"
          : `/courses/${courseId}/lesson?lessonId=${lesson.lesson_id}&moduleId=${lesson.module_id}&userId=${userId}`
      }
      className={cn(
        "flex items-center gap-x-2 text-emerald-800 text-sm font-[500] transition-all hover:text-emerald-500",
        isPrivate(lesson)
          ? "text-slate-700 cursor-default hover:text-slate-700"
          : state === 1 && "text-emerald-700 hover:text-emerald-700"
      )}
    >
      <div className="flex items-center gap-x-2">
        {lessonIcon()}
        {lesson?.lesson_title}
      </div>
    </Link>
  );
};
