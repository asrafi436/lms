import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/formatPrice";
import { auth } from '@/auth';
import { getUserByEmail } from '@/queries/users';
import { getCoursesData } from '@/queries/dashHome';
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/login/");
  }

  // Fetch user by email from MySQL
  const loggedInUser = await getUserByEmail(session.user.email);
  if (!loggedInUser) {
    console.error('User not found in MySQL');
    redirect("/login");
  }

  // Fetch course data for the instructor
  const courseData = await getCoursesData(loggedInUser.id);
  if (!courseData || !courseData.courses) {
    console.error('No courses found for the instructor');
    return <p>No courses found.</p>;
  }

  // Compute total courses, enrollments, and revenue
  const totalCourses = Object.keys(courseData.courses).length;
  const totalEnrollments = Object.values(courseData.courses).reduce((sum, course) => sum + course.students.length, 0);
  const totalRevenue = Object.values(courseData.courses).reduce((sum, course) => sum + (course.students.length * course.price), 0);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Total Courses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
          </CardContent>
        </Card>

        {/* Total Enrollments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
