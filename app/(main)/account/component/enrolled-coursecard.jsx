import React from 'react';
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import Image from "next/image";

const EnrolledCourseCard = ({ enrollment }) => {
    // Destructure enrollment and course data
    const {
        course_title,
        course_description,
        course_thumbnail,
        course_price,
        course_active,
        course_modules,
        course_testimonials,
    } = enrollment;

    // Assuming module data in course_modules (stringified JSON) and parsing it
    const modules = JSON?.parse(course_modules);
    
    // Get total modules and completed modules (hardcoded for now, adjust as needed)
    const totalModules = modules?.length;
    const completedModules = 5; // Hardcoded for now, replace with actual data (e.g. from report)

    // Get total quizzes (assuming quiz data is available in the course_testimonials)
    const totalQuizzes = 10; // Hardcoded for now, replace with actual data from report
    const quizzesTaken = 10; // Hardcoded, replace with actual data

    // Calculate marks (just an example, you should replace with real data from quizzes)
    const marksFromQuizzes = quizzesTaken * 5; // Assuming each quiz has 5 marks
    const otherMarks = 50; // Hardcoded, replace with actual data
    const totalMarks = marksFromQuizzes + otherMarks;

    return (
        <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
            <div className="relative w-full aspect-video rounded-md overflow-hidden">
                <Image
                    src={`/assets/images/courses/${course_thumbnail}`}
                    alt={course_title}
                    className="object-cover"
                    fill
                />
            </div>
            <div className="flex flex-col pt-2">
                <div className="text-lg md:text-base font-medium group-hover:text-sky-700 line-clamp-2">
                    {course_title}
                </div>
                <span className="text-xs text-muted-foreground">Development</span>
                <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                    <div className="flex items-center gap-x-1 text-slate-500">
                        <BookOpen className="w-4" />
                        <span>{totalModules} Chapters</span>
                    </div>
                </div>
                <div className="border-b pb-2 mb-2">
                    <div className="flex items-center justify-between">
                        <span className="text-md md:text-sm font-medium text-slate-700">
                            Total Modules: {totalModules}
                        </span>
                        <div className="text-md md:text-sm font-medium text-slate-700">
                            Completed Modules <Badge variant="success">{completedModules}</Badge>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-md md:text-sm font-medium text-slate-700">
                            Total Quizzes: {totalQuizzes}
                        </span>
                        <div className="text-md md:text-sm font-medium text-slate-700">
                            Quiz taken <Badge variant="success">{quizzesTaken}</Badge>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-md md:text-sm font-medium text-slate-700">
                            Marks from Quizzes
                        </span>
                        <span className="text-md md:text-sm font-medium text-slate-700">
                            {marksFromQuizzes}
                        </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-md md:text-sm font-medium text-slate-700">
                            Others
                        </span>
                        <span className="text-md md:text-sm font-medium text-slate-700">
                            {otherMarks}
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-md md:text-sm font-medium text-slate-700">
                        Total Marks
                    </span>
                    <span className="text-md md:text-sm font-medium text-slate-700">
                        {totalMarks}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default EnrolledCourseCard;
