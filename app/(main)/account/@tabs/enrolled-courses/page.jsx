import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getEnrolledCourses } from '@/queries/enrollments';
import EnrolledCourseCard from "../../component/enrolled-coursecard";
import { getUserByEmail } from '@/queries/users';
import Link from "next/link";

const EnrolledCoursesPage = async () => {
    // Get the session server-side
    const session = await auth();

    // Redirect to login if not logged in
    if (!session?.user) {
        redirect("/login/");
    }

    // Fetch user by email from MySQL
    const loggedInUser = await getUserByEmail(session.user.email);

    if (!loggedInUser) {
        console.error('User not found in MySQL');
        redirect("/login");
    }

    // Fetch enrolled courses for the user
    const enrolledCourses = await getEnrolledCourses(loggedInUser.id);
	if (!enrolledCourses) {
		console.error('No enrolled courses found for the user');
		return <p>No enrolled courses found.</p>;
	}
	// console.log(enrolledCourses)

    return (
        <div className="grid sm:grid-cols-2 gap-6">
            {enrolledCourses.length > 0 ? (
                enrolledCourses.map((enrollment) => (
                    <Link
 					key={enrollment?.id}
 					href={`/courses/${enrollment.course_id.toString()}/lesson`}
 					> 
 					<EnrolledCourseCard key={enrollment?.id} enrollment={enrollment} userId={loggedInUser} />
 					</Link>
                ))
            ) : (
                <p>No enrolled courses found.</p>
            )}
        </div>
    );
};

export default EnrolledCoursesPage;
