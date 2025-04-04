"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Ensure toast notifications are used

import {Form,FormControl,FormField,FormItem,FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

import { updateSubtitle } from "@/app/action/course";

const formSchema = z.object({
  subtitle: z.string().min(1, {
    message: "Subtitle is required",
  }),
});

export const SubtitleForm = ({ initialData, courseId }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    try {
      const response = await updateSubtitle(courseId, values.subtitle);

      if (response.success) {
        toast.success("Course subtitle updated successfully!");
        toggleEdit();
        router.refresh();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-gray-50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course subtitle
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? <>Cancel</> : <><Pencil className="h-4 w-4 mr-2" /> Edit Subtitle</>}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-2">{initialData.subtitle}</p>}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder="e.g. 'Advanced web development'" {...field} />
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
