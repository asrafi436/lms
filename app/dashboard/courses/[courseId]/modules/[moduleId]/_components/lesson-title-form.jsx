"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { updateTitle } from "@/app/action/lesson"; // Import the updateTitle action

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const LessonTitleForm = ({ initialData, courseId, lessonId }) => {

  
  const [lessonTitle, setLessonTitle] = useState(initialData?.title || "Untitled Lesson");
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { title: lessonTitle }, // Set default value to current title
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    setLoading(true); // Set loading state to true
    try {
      toast.info("Updating module title...");
      
      // Call the action to update the module title
      const res = await updateTitle(lessonId, values.title);

      if (!res.success) {
        throw new Error(res.message);
      }

      // After the title is successfully updated, update local state to reflect the change
      setLessonTitle(values.title);

      toast.success("Lesson updated");
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
        Lesson title
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Title
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        // Display the actual title from lessonTitle state
        <p className="text-sm mt-2">{lessonTitle}</p>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting || loading} // Disable input while submitting or loading
                      placeholder="e.g. 'Introduction to the course'"
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
