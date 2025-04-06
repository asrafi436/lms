"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {Form,FormControl,FormField,FormItem,FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { LessonList } from "./lesson-list";
import { LessonModal } from "./lesson-modal";
import { createModuleLesson, reOrderLessons } from "@/app/action/lesson"; 
import { getLessonByLessonId } from "@/queries/lessons";




const formSchema = z.object({
  title: z.string().min(1),
});

export const LessonForm = ({ initialData, moduleId,courseId }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [lessons, setLessons] = useState(initialData || []);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const [lessonToEdit, setLessonToEdit] = useState(null);

  const toggleEditing = () => setIsEditing((current) => !current);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleCreating = () => {
    setIsCreating((curr) => !curr);
  };

  const onSubmit = async (values) => {
   try {
         if (!moduleId) {
           toast.error("Invalid course ID");
           return;
         }
   
         const newOrder = lessons.length;
         const newLesons = await createModuleLesson(moduleId, {
           ...values,
           order: newOrder,
         });
   
         setLessons((prev) => [...prev, newLesons]);
         toast.success("Lesson created successfully");
         toggleCreating();
         form.reset();
         router.refresh();
       } catch (error) {
         toast.error("Something went wrong");
         console.error("Lesson creation error:", error);
       }
  };

   const onReorder = async (updateData) => {
      try {
        await reOrderLessons(updateData);
        setIsUpdating(true);
  
        toast.success("Lesson reordered");
        router.refresh();
      } catch (error) {
        toast.error("Something went wrong");
        console.error("Reorder error:", error);
      } finally {
        setIsUpdating(false);
      }
    };

  const startEdit = async (id) => {
    const foundLesson = await getLessonByLessonId(id );
    console.log("Editing lesson:", foundLesson);
    setLessonToEdit(foundLesson);
    setIsEditing(true);
  };


  const sortedLessons = lessons.sort((a, b) => a.order - b.order);

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-gray-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Module Lessions
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
              <div className={cn(
                "text-sm mt-2", 
                !lessons?.length && "text-slate-500 italic")}>
                {!lessons?.length && "No module"}
                <LessonList items={sortedLessons} onEdit={startEdit} onReorder={onReorder} />
              </div>
            )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag & Drop to reorder the Lessons
        </p>
      )}
            <LessonModal open={isEditing} setOpen={setIsEditing} courseId={courseId} lesson={lessonToEdit} moduleId={moduleId} />
      {/*  */}
    </div>
  );
};
