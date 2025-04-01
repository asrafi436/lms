'use client'

import { SectionTitle } from "@/components/section-title";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatPrice";
import { getInstructorWiseCourse } from "@/queries/courseProvided";
import { ArrowRight, BookOpen, Presentation, Star, UsersRound, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from 'react';
import { useParams } from "next/navigation";

const InstructorProfile = () => {
  const { id } = useParams();
  const [courses, setCourses] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [error, setError] = useState(null); // Added error state

  // Fetch instructor data and courses when the component mounts
  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const data = await getInstructorWiseCourse(id); // Fetch courses for the instructor
        setCourses(data);

        // Extract instructor details from the first course (assuming all courses have the same instructor)
        if (data.length > 0) {
          setInstructor(data[0]); // Set the instructor from the first course data
        }
      } catch (error) {
        console.error("Error fetching instructor data:", error);
        setError("Error fetching instructor data."); // Set error state
      }
    };

    fetchInstructorData();
  }, [id]);

  if (error) {
    return <div>{error}</div>; // Show error message if any
  }

  if (!instructor) {
    return <div>Loading...</div>; // Loading state
  }

  // Assuming module data in course_modules (stringified JSON) and parsing it
  // const modules = JSON.parse(courses?.course_modules);
    
  // // Get total modules and completed modules (hardcoded for now, adjust as needed)
  // const totalModules = modules.length;
  // console.log(totalModules);

  return (
    <section id="categories" className="space-y-6 py-6 lg:py-12">
      <div className="container grid grid-cols-12 lg:gap-x-8 gap-y-8">
        {/* Instructor Info */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="mb-6">
              <div className="w-36 h-36 rounded-full mb-5 mx-auto overflow-hidden">
                <img
                  src={instructor.instructor_profile_picture || "/default-profile.png"}
                  alt={instructor.instructor_first_name}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              <div>
                <h4 className="text-xl lg:text-2xl text-center">{`${instructor.instructor_first_name} ${instructor.instructor_last_name}`}</h4>
                <div className="text-gray-600 font-medium mb-6 text-sm text-center">{instructor.instructor_designation}</div>
                <ul className="items-center gap-3 flex-wrap text-sm text-gray-600 font-medium grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 md:grid-cols-4">
                  <li className="flex items-center space-x-3">
                    <Presentation className="text-gray-600 w-4" />
                    <div>{courses.length} Courses</div>
                  </li>
                  <li className="flex items-center space-x-3">
                    <UsersRound className="text-gray-600 w-4" />
                    <div>{instructor.students_count || 0} Students</div>
                  </li>
                  <li className="flex items-center space-x-3">
                    <MessageSquare className="text-gray-600 w-4" />
                    <div>{instructor.reviews_count || 0} Reviews</div>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Star className="text-gray-600 w-4" />
                    <div>{instructor.average_rating || 'N/A'} Average Rating</div>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-gray-600 text-xs leading-[1.8] text-justify">
              {instructor.instructor_bio}
            </p>
          </div>
        </div>

        {/* Courses */}
        <div className="col-span-12 lg:col-span-8">
          <div>
            <SectionTitle className="mb-6">Courses</SectionTitle>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {courses.map((course) => {
               
                return (
                  <Link key={course.course_id} href={`/courses/${course.course_id}`}>
                    <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
                      <div className="relative w-full aspect-video rounded-md overflow-hidden">
                        <Image
                          src={`/assets/images/courses/${course?.course_thumbnail}`}
                          alt={course?.course_title}
                          className="object-cover"
                          fill
                        />
                      </div>
                      <div className="flex flex-col pt-2">
                        <div className="text-lg md:text-base font-medium group-hover:text-sky-700 line-clamp-2">
                          {course?.course_title}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {course?.category_title}
                        </p>
                        <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                          <div className="flex items-center gap-x-1 text-slate-500">
                            <div>
                              <BookOpen className="w-4" />
                            </div>
                            {/* JSON.parse(course?.course_modules) */}



                            <span> {course?.course_modules?.length} Modules </span>



                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <p className="text-md md:text-sm font-medium text-slate-700">
                            {formatPrice(course.course_price)}
                          </p>

                          <Button variant="ghost" className="text-xs text-sky-700 h-7 gap-1">
                            Enroll
                            <ArrowRight className="w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorProfile;
