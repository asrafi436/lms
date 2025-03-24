import React from 'react';
import { BookCheck } from "lucide-react";
import { Clock10 } from "lucide-react";
import { Radio } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import CourseModuleList from './module/CourseModuleList';

const CourseCurriculam = ({ course }) => {

    // Parse the JSON string into an object
    const courseModules = JSON.parse(course?.course_modules);

    const numberOfModules = courseModules.length;
    // Your JSON string

    // Initialize a variable to store total duration
    let totalDurationInMinutes = 0;

    // Iterate through each module and its lessons to sum the durations
    courseModules.forEach(module => {
        // Parse the lessons string into an array
        const lessons = JSON.parse(module.lessons);

        lessons.forEach(lesson => {
            totalDurationInMinutes += lesson.duration;
        });
    });

    // Convert total duration from minutes to HH:MM
    const hours = Math.floor(totalDurationInMinutes / 60);
    const minutes = totalDurationInMinutes % 60;
    const formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;



    return (
        <div>
            <div className="flex gap-x-5 items-center justify-center flex-wrap mt-4 mb-6 text-gray-600 text-sm">
                <span className="flex items-center gap-1.5">
                    <BookCheck className="w-4 h-4" />
                    Total: {numberOfModules} Chapters
                </span>
                <span className="flex items-center gap-1.5">
                    <Clock10 className="w-4 h-4" />
                    Total: {formattedDuration}+ Hours
                </span>
                <span className="flex items-center gap-1.5">
                    <Radio className="w-4 h-4" />4 Live Class
                </span>
            </div>

            {/* contents */}
            <Accordion
                defaultValue={["item-1", "item-2", "item-3"]}
                type="multiple"
                // collapsible={true}
                collapsible="true"
                className="w-full"
            >


                {/* <CourseModuleList /> */}

                {
                    courseModules && courseModules.map((module, index) => (
                        <CourseModuleList key={module.module_id || index} module={module} />
                    ))
                }

            </Accordion>
            {/* contents end */}
        </div>
    );
};

export default CourseCurriculam;