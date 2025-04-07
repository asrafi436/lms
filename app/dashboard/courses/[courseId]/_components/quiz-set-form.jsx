"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getQuizsets, updateQuizsetId, getCourseData } from "@/app/action/quize";

// Validation schema
const formSchema = z.object({
  quizSetId: z.string().min(1),
});

export const QuizSetForm = ({ initialData, courseId }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [quizsets, setQuizsets] = useState([]);
  const [selectedQuizset, setSelectedQuizset] = useState(null); // State to store selected quiz set

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quizSetId: initialData?.quizSetId || "",
    },
  });

  // Fetch quizsets and course details
  useEffect(() => {
    const fetchQuizsets = async () => {
      try {
        const res = await getQuizsets(); // Fetch quizsets
        const formattedOptions = res.map((quizset) => ({
          value: quizset.quizset_id,
          label: quizset.quizset_title,
        }));

        const course = await getCourseData(courseId); // Fetch course data

        // Find the selected quizset from the fetched data based on quizset_id
        const selectedQuizset = res.find(
          (quizset) => quizset.quizset_id === course?.quizset_id
        );
        setQuizsets(formattedOptions); // Update quizsets options
        setSelectedQuizset(selectedQuizset); // Set the selected quizset
      } catch (error) {
        console.error("Error fetching quizsets or course data:", error);
      }
    };

    fetchQuizsets();
  }, [courseId]);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    try {
      console.log("Selected quizSetId:", values.quizSetId);
      await updateQuizsetId(courseId, values.quizSetId); // Update quiz set ID in course
      toast.success("Course updated successfully");
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.error("Error updating course quiz set:", error);
      toast.error("Something went wrong while updating");
    }
  };

  return (
    <div className="mt-6 border bg-gray-50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Quiz Set
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? <>Cancel</> : <>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Quiz Set
          </>}
        </Button>
      </div>

      {/* Display the title of the selected quiz set when not editing */}
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.quizSetId && "text-slate-500 italic"
          )}
        >
          {selectedQuizset ? selectedQuizset.quizset_title : "No quiz set selected"}
        </p>
      )}

      {/* Form for selecting a quiz set */}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="quizSetId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={quizsets} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
