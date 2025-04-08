import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { sendEmails } from "@/lib/emails";
import { insertEnrollment } from "@/lib/enrollments"; // Import the function

const Success = async ({ searchParams: { session_id, courseId } }) => {
  
  if (!session_id) {
    throw new Error("Please provide a valid session id", session_id);
  }

  // Get user session to check if the user is logged in
  const userSession = await auth();

  if (!userSession?.user?.email) {
    redirect("/login"); // Redirect to login page if no user session
  }

  // Fetch course details
  const courseResponse = await fetch(`http://localhost:3000/api/courses/${courseId}`);
  const course = await courseResponse.json();

  if (!course) {
    throw new Error("Course not found");
  }

  // Fetch the user data from the API
  const userResponse = await fetch(`http://localhost:3000/api/users`);
  const { users } = await userResponse.json();

  // Find the logged-in user by matching email
  const loggedInUser = users.find((user) => user.email === userSession.user.email);

  // Retrieve the Stripe checkout session
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const paymentIntent = checkoutSession?.payment_intent;
  const paymentStatus = paymentIntent?.status;

  /// Customer Info 
  const customerName = `${loggedInUser?.first_name} ${loggedInUser?.last_name}`;
  const customerEmail = loggedInUser?.email;
  const productName = course?.course?.course_title;

  if (paymentStatus === "succeeded") {
    try {
      /// Insert data into the enrollment table
      const enrollmentData = {        
        enrollment_date: new Date().toISOString().split("T")[0], // Current date
        status: "pending", // Default status
        completion_date: null, // Set to null initially
        method: "stripe",
        course_id: course?.course?.course_id,
        student_id: loggedInUser?.id,
      };

      const enrolled = await insertEnrollment(enrollmentData);
      console.log("Enrollment success:", enrolled);
    } catch (error) {
      console.error("Error enrolling user:", error);
    }

    // Send emails to the instructor and student
    const instructorName = `${course?.course?.instructor_first_name} ${course?.course?.instructor_last_name}`;
    const instructorEmail = course?.course?.instructor_email;

    const emailsToSend = [
      {
        to: instructorEmail,
        subject: `New Enrollment For ${productName}`,
        message: `Congratulations, ${instructorName}. A new student, ${customerName} has enrolled in your course ${productName} just now.`
      },
      {
        to: customerEmail,
        subject: `Enrollment success for ${productName}`,
        message: `Hey, ${customerName}. You have successfully enrolled in the course ${productName}.`
      }
    ];

    await sendEmails(emailsToSend);
  }

  return (
    <div className="h-full w-full flex-1 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-6 max-w-[600px] text-center">
        {
          paymentStatus === "succeeded" && (
            <>
              <CircleCheck className="w-32 h-32 bg-green-500 rounded-full p-0 text-white" />
              <h1 className="text-xl md:text-2xl lg:text-3xl">
                Congratulations! <strong>{customerName}</strong>, your enrollment in <strong>{productName}</strong> was successful!
              </h1>
            </>
          )
        } 
        <div className="flex items-center gap-3">
          <Button asChild size="sm">
            <Link href="/courses">Browse Courses</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
          <Link href={`/courses/${courseId}/lesson`}>Play Course</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Success;
