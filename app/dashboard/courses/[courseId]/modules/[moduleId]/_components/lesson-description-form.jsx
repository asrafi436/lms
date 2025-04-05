"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea"; // Make sure you're using Textarea here
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { updateDescription } from "@/app/action/lesson"; // Import the updateDescription action

const formSchema = z.object({
  description: z.string().min(1, "Description is required"), // Validate description
});

export const LessonDescriptionForm = ({ initialData, courseId, lessonId }) => {
  const [lessonDescription, setLessonDescription] = useState(initialData?.description || "No description provided");
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { description: lessonDescription }, // Set default value to current description
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    setLoading(true); // Set loading state to true
    try {
      toast.info("Updating lesson description...");
      
      // Call the action to update the lesson description
      const res = await updateDescription(lessonId, values.description);

      if (!res.success) {
        throw new Error(res.message);
      }

      // After the description is successfully updated, update local state to reflect the change
      setLessonDescription(values.description);

      toast.success("Lesson description updated");
      toggleEdit();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false); // Reset loading state after the request is complete
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Description
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Description
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        // Display the actual description from lessonDescription state
        <p className="text-sm mt-2">{lessonDescription}</p>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting || loading} // Disable input while submitting or loading
                      placeholder="e.g. 'This lesson is about...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting || loading} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
