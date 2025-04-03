import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { auth } from '@/auth';
import { getUserByEmail } from '@/queries/users';
import { getCoursesData } from '@/queries/dashHome';
import { redirect } from "next/navigation";

const CoursesPage = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/login/");
  }

  // Fetch user details
  const loggedInUser = await getUserByEmail(session.user.email);
  if (!loggedInUser) {
    console.error('User not found in MySQL');
    redirect("/login");
  }

  // Fetch courses
  const courseData = await getCoursesData(loggedInUser.id);
  if (!courseData || !courseData.courses) {
    console.error('No courses found for the instructor');
    return <p>No courses found.</p>;
  }

  // Transform courses for DataTable
  const courses = Object.keys(courseData.courses).map(courseId => {
    const course = courseData.courses[courseId];
    return {
      id: courseId,
      title: course.course_title,
      price: course.price,
      isPublished: course.active === 1, // Convert active flag to boolean
    };
  });

  return (
    <div className="p-6">
      {/* <Link href="/teacher/create">
        <Button>New Course</Button>
      </Link> */}
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
