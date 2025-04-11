"use server";

import { createReview as createOrUpdateTestimonial } from "@/queries/testimonials"; // import the real DB function

export async function createReview(data, loginid, courseId) {
  try {
    console.log("data", data);
    console.log("loginid", loginid);
    console.log("courseId", courseId);

    // Call the DB logic function
    const result = await createOrUpdateTestimonial(data, loginid, courseId);

    console.log("Testimonial result:", result);

    return result;
  } catch (error) {
    console.error("Error in createReview server action:", error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
