import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseOverview from "./CourseOverview";
import CourseCurriculam from "./CourseCurriculam";
import CourseInstructor from "./CourseInstructor";
import Image from 'next/image';
import { formatMyDate } from '@/lib/date';

const CourseDetails = ({ course }) => {
    const last_updated = formatMyDate(course.modified_on);

    return (
        <section className="py-8 md:py-12 lg:py-24 mx-0 md:mx-auto px-5">
            <div className="container">
                <span className="bg-green-500 px-4 py-0.5 rounded-full text-xs font-medium text-white inline-block">
                    {course?.category_title}
                </span>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold 2xl:text-5xl mt-3">
                    {course?.course_title}
                </h3>
                <p className="mt-3 text-gray-600 text-sm">
                    {course?.course_subtitle}
                </p>
                {/*  */}
                <div className="flex sm:items-center gap-5 flex-col sm:flex-row sm:gap-6 md:gap-20 mt-6">
                    <div className="flex items-center gap-2">
                        <Image
                            src={course?.instructor_profile_picture || "https://i.pravatar.cc/40"}
                            alt={course?.instructor_first_name || "Instructor"}
                            width={40}
                            height={40}
                            className="rounded-full"
                            unoptimized // Disable Next.js optimization
                        />

                        <p className="font-bold">{`${course?.instructor_first_name} ${course?.instructor_last_name}`}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-success font-semibold">Last Updated: </span>
                        <span>{last_updated}</span>
                    </div>
                </div>

                {/* Tab */}
                <div className="my-6">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 my-6 max-w-[768px]">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="curriculum">Carriculum</TabsTrigger>
                            <TabsTrigger value="instructor">Instructor</TabsTrigger>
                            {/* <TabsTrigger value="reviews">Reviews</TabsTrigger> */}
                        </TabsList>

                        <TabsContent value="overview">
                            <CourseOverview course={course} />
                        </TabsContent>

                        <TabsContent value="curriculum">
                            <CourseCurriculam course={course}/>
                        </TabsContent>

                        <TabsContent value="instructor">
                            <CourseInstructor course={course} />
                        </TabsContent>

                    </Tabs>
                </div>
            </div>
        </section>
    );
};

export default CourseDetails;