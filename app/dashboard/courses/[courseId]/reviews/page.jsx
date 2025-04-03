import { getCourseTestimonial } from "@/queries/dashCourses"; // Adjust the import path
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

const ReviewsPage = async ({ params }) => {
  const { courseId } = params; // Destructure params to get the courseId

  // Fetch testimonials from the database based on courseId
  let reviews = [];
  try {
    const { testimonials } = await getCourseTestimonial(courseId); // Get the testimonials using the function

    // Map the testimonials to match the structure your DataTable component expects
    reviews = testimonials.map(testimonial => ({
      id: testimonial.testimonial_id,
      student: { name: testimonial.student_name },
      review: testimonial.testimonial_content,
      rating: testimonial.testimonial_rating,
    }));
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    // Handle the error, e.g., show an error message
  }

  return (
    <div className="p-6">
      <h2>Course Reviews</h2>
      {/* Pass the columns and reviews to the DataTable component */}
      <DataTable columns={columns} data={reviews} />
    </div>
  );
};

export default ReviewsPage;
