"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateAccess } from "@/app/action/lesson";

const formSchema = z.object({
  isPublic: z.boolean().default(false),
});

export const LessonAccessForm = ({ initialData, courseId, lessonId }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialIsPublic = Boolean(Number(initialData.access)); // ✅ Force convert to true/false

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isPublic: initialIsPublic,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      toast.info("Updating lesson access...");

      const res = await updateAccess(lessonId, values.isPublic);

      if (!res.success) {
        throw new Error(res.message);
      }

      toast.success("Lesson access updated");
      setIsEditing(false);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isEditing) {
      form.reset({
        isPublic: initialIsPublic, // ✅ Re-apply boolean reset
      });
    }
  }, [isEditing, form, initialIsPublic]);

  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Lesson access
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? "Cancel" : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit access
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialIsPublic && "text-slate-500 italic"
          )}
        >
          {initialIsPublic ? (
            <>This chapter is public</>
          ) : (
            <>This chapter is private</>
          )}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(val) => field.onChange(!!val)} // ✅ Ensure boolean
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      Check this box if you want to make this chapter public.
                    </FormDescription>
                  </div>
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
