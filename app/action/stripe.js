"use server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { formatAmountForStripe } from "@/lib/stripe-helpers";

const CURRENCY = "USD";

export async function createCheckoutSession(data) {
    try {
        const origin = (await headers()).get("origin");
        const courseId = data.get("courseId");

        //   Ensure courseId is provided
        if (!courseId) {
            throw new Error("   Missing course ID");
        }

        console.log("  Creating checkout session for Course ID:", courseId);

        //   Fetch course details dynamically
        const courseRes = await fetch(`${origin}/api/courses/${courseId}`);
        if (!courseRes.ok) {
            throw new Error(`   Failed to fetch course details: ${courseRes.status}`);
        }
        const courseData = await courseRes.json();
        const course = courseData.course;

        if (!course || !course.course_price) {
            throw new Error("   Course details missing or price is undefined.");
        }

        //   Use formatAmountForStripe to convert price to cents
        const priceInCents = formatAmountForStripe(course?.course_price, CURRENCY);

        // Define the `ui_mode` variable as "hosted"
        const ui_mode = "hosted";

        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "payment",
            submit_type: "auto",
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: CURRENCY,
                        product_data: {
                            name: course.course_title || "Course Enrollment",
                        },
                        unit_amount: priceInCents,  // Use dynamically calculated price
                    },
                },
            ],
            success_url: `${origin}/enroll-success?session_id={CHECKOUT_SESSION_ID}&courseId=${courseId}`,
            cancel_url: `${origin}/courses`,
            ui_mode,  // Use hosted checkout session mode
        });

        console.log("Checkout session created successfully:", checkoutSession.id);

        return {
            client_secret: checkoutSession.client_secret,
            url: checkoutSession.url,
        };
    } catch (error) {
        console.error("   Error creating checkout session:", error.message);
        throw new Error("Failed to create checkout session.");
    }
}

//   Function for Payment Intent (Optional)
export async function createPaymentIntent(data) {
    try {

        const paymentIntent = await stripe.paymentIntents.create({
            priceInCents,
            automatic_payment_methods: { enabled: true },
            currency: CURRENCY,
        });

        return { client_secret: paymentIntent.client_secret };
    } catch (error) {
        console.error("Error creating payment intent:", error.message);
        throw new Error("Failed to create payment intent.");
    }
}
