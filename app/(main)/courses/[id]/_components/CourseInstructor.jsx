'use client'
import { UsersRound, MessageSquare, Star, Presentation } from "lucide-react";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const CourseInstructor = ({ course }) => {
    const [studentsCount, setStudentsCount] = useState(0);
    const [totalCourses, setTotalCourses] = useState(0);
    const [reviewsCount, setReviewsCount] = useState(0);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!course?.course_id || !course?.instructor_id) return; // Ensure course data is available

            try {
                // Fetch enrollments
                const enrollmentsResponse = await fetch('/api/enrollments');
                const enrollmentsData = await enrollmentsResponse.json();

                if (enrollmentsData.enrollments) {
                    const courseEnrollments = enrollmentsData.enrollments.filter(enrollment => enrollment.course_id === course.course_id);

                    // Get unique student count
                    const uniqueStudents = new Set(courseEnrollments.map(enrollment => enrollment.student_id));
                    setStudentsCount(uniqueStudents.size);
                }

                // Fetch all courses
                const coursesResponse = await fetch('/api/courses');
                const coursesData = await coursesResponse.json();

                if (coursesData.courses) {
                    const instructorCourses = coursesData.courses.filter(c => c.instructor_id === course.instructor_id);
                    setTotalCourses(instructorCourses.length); // Set the number of courses taught by the instructor
                }

                // Ensure course_testimonials is a string, then parse it
                let testimonials = [];
                if (typeof course?.course_testimonials === 'string') {
                    testimonials = JSON.parse(course.course_testimonials);
                } else if (Array.isArray(course?.course_testimonials)) {
                    testimonials = course.course_testimonials;
                }

                setReviewsCount(testimonials.length); // Set the number of reviews

                // Calculate the average rating
                const totalRating = testimonials.reduce((acc, testimonial) => acc + testimonial.rating, 0);
                const avgRating = totalRating / testimonials.length;
                setAverageRating(avgRating.toFixed(1)); // Set the average rating (rounded to 1 decimal)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [course?.course_id, course?.instructor_id, course?.course_testimonials]); // Watch for changes in course data

    return (
        <div className="bg-gray-50 rounded-md p-8">
            <div className="md:flex md:gap-x-5 mb-8">
                <div className="h-[310px] w-[270px] max-w-full flex-none rounded mb-5 md:mb-0">
                    <Image
                        src={course?.instructor_profile_picture || "https://i.pravatar.cc/40"}
                        alt={course?.instructor_first_name || "Instructor"}
                        height={200}
                        width={200}
                        className="w-full h-full object-cover rounded"
                        unoptimized
                    />
                </div>
                <div className="flex-1">
                    <div className="max-w-[300px]">
                        <h4 className="text-[34px] font-bold leading-[51px]">
                            {`${course?.instructor_first_name} ${course?.instructor_last_name}`}
                        </h4>
                        <div className="text-gray-600 font-medium mb-6">
                            {course?.instructor_designation}
                        </div>

                        <ul className="list space-y-4">
                            {/* Show the number of courses taught by the instructor */}
                            <li className="flex items-center space-x-3">
                                <Presentation className="text-gray-600" />
                                <div>{totalCourses}+ Courses Taught</div>
                            </li>
                            <li className="flex items-center space-x-3">
                                <UsersRound className="text-gray-600" />
                                <div>{studentsCount}+ Unique Students</div>
                            </li>
                            <li className="flex items-center space-x-3">
                                <MessageSquare className="text-gray-600" />
                                <div>{reviewsCount}+ Reviews</div> {/* Show review count dynamically */}
                            </li>
                            <li className="flex items-center space-x-3">
                                <Star className="text-gray-600" />
                                <div>{averageRating} Average Rating</div> {/* Display the average rating */}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <p className="text-gray-600">
                {course?.instructor_bio}
            </p>
        </div>
    );
};

export default CourseInstructor;
