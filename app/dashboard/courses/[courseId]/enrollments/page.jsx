import { getEnrollmentsData } from "@/queries/dashCourses"; // Adjust the import path
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

const EnrollmentsPage = async ({ params }) => {
  const { courseId } = params; // Destructure params to get courseId

  console.log(courseId); // This will log the correct courseId

  let enrollments = [];

  try {
    const response = await getEnrollmentsData(courseId); // Fetch enrollment data based on courseId
    enrollments = response.enrollments; // Get the data from the response

  } catch (error) {
    console.error("Error fetching enrollments data:", error);
    // Optionally handle error (e.g., show an error message to the user)
  }

  return (
    <div className="p-6">
      <h2>Enrollments for Course ID: {courseId}</h2>
      <DataTable columns={columns} data={enrollments} />
    </div>
  );
};

export default EnrollmentsPage;
