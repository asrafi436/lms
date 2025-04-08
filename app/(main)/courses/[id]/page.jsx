'use client'
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CourseDetailsIntro from "./_components/CourseDetailsIntro";
import CourseDetails from "./_components/CourseDetails";
import Testimonials from "./_components/Testimonials";
import RelatedCourses from "./_components/RelatedCourses";
import { SessionProvider } from "next-auth/react"


const SingleCoursePage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            try {
                console.log("Fetching course data for ID:", id); // Debugging

                const res = await fetch(`/api/courses/${id}`);

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();
                console.log("API Response:", data); // Debugging

                // ✅ Ensure testimonials are parsed from string to array
                const testimonials = data.course.course_testimonials 
                    ? JSON.parse(data.course.course_testimonials)
                    : [];

                setCourse({ ...data.course, course_testimonials: testimonials });
            } catch (error) {
                console.error("Error fetching course:", error);
                setError("Failed to load course.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!course) return <p>Course not found</p>;

    return (
        <>
            <SessionProvider>
            <CourseDetailsIntro  course={course} />
            </SessionProvider>


            
            <CourseDetails course={course} />

            <Testimonials testimonials={course.course_testimonials} />

            <RelatedCourses />
        </>
    );
};

export default SingleCoursePage;
