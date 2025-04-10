import React from 'react';
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import { CourseProgress } from '@/components/course-progress';
import { courseLessonCount } from "@/queries/lessons"; 
import { countStudentLessonsProgress } from "@/queries/lessonProgress"; 

const EnrolledCourseCard = async ({ enrollment, userId }) => {
    // Destructure enrollment and course data
    const {
        course_id,
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
    console.log("enrollment user: ",userId)

    const lessonCount = await courseLessonCount( course_id);
    const lessonCompletedCount = await countStudentLessonsProgress(  userId.id, course_id);
    const progressPercentage = Math.floor((lessonCompletedCount / lessonCount?.total_lessons) * 100);



    // Get total quizzes (assuming quiz data is available in the course_testimonials)
    // const totalQuizzes = 10; 
    // const quizzesTaken = 10; 

    // // Calculate marks (just an example, you should replace with real data from quizzes)
    // const marksFromQuizzes = quizzesTaken * 5; // Assuming each quiz has 5 marks
    // const otherMarks = 50; 
    // const totalMarks = marksFromQuizzes + otherMarks;

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
                        <span>Lesson Completed {lessonCompletedCount}/{lessonCount?.total_lessons}</span>
                    </div>
                </div>
                {/* <div className="border-b pb-2 mb-2">
                    
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
                </div> */}
                <CourseProgress
                    size="sm"
                    value={progressPercentage}
                    variant={110 === 100 ? "success" : ""}
                />
            </div>
        </div>
    );
};

export default EnrolledCourseCard;
