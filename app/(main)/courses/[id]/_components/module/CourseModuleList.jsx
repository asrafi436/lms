import React from 'react';
import { Video } from "lucide-react";
import { NotepadText } from "lucide-react";
import { FileQuestion } from "lucide-react";
import { Radio } from "lucide-react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CourseLessonList from './CourseLessonList';

const CourseModuleList = ({ module }) => {
    const lessons = JSON.parse(module?.lessons) || [];
    const numberOfLessons = lessons.length;

    // Example dynamic values (you can replace these with actual data)
    const numberOfNotes = 10; // Replace with actual note count if available
    const numberOfQuizzes = 10; // Replace with actual quiz count if available
    const numberOfLiveClasses = 1; // Replace with actual live class count if available

    return (
        <div>
            <AccordionItem className="border-none" value={`item-${module.module_id}`}>
                <AccordionTrigger>{module.module_title || "Introduction"}</AccordionTrigger>
                <AccordionContent>
                    {/* header */}
                    <div className="flex gap-x-5 items-center flex-wrap mt-4 mb-6 text-gray-600 text-sm">
                        <span className="flex items-center gap-1.5">
                            <Video className="w-4 h-4" />
                            {numberOfLessons} Lessons
                        </span>
                        <span className="flex items-center gap-1.5">
                            <NotepadText className="w-4 h-4" />
                            {numberOfNotes} Notes
                        </span>
                        <span className="flex items-center gap-1.5">
                            <FileQuestion className="w-4 h-4" />
                            {numberOfQuizzes} Quizzes
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Radio className="w-4 h-4" />
                            {numberOfLiveClasses} Live Class
                        </span>
                    </div>
                    {/* header ends */}

                    <div className="space-y-3">
                        {/* Render CourseLessonList dynamically with lessons data */}
                        <CourseLessonList lessons={lessons} />
                    </div>
                </AccordionContent>
            </AccordionItem>
        </div>
    );
};

export default CourseModuleList;
