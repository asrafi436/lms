"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ModuleList } from "./module-list";
import { createCourseModule, reOrderModules } from "@/app/action/module"; // removed updateTitle import

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const ModulesForm = ({ initialData, courseId }) => {
  const [modules, setModules] = useState(initialData || []);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleCreating = () => {
    setIsCreating((curr) => !curr);
  };

  const onSubmit = async (values) => {
    try {
      if (!courseId) {
        toast.error("Invalid course ID");
        return;
      }

      const newOrder = modules.length;
      const newModule = await createCourseModule(courseId, {
        ...values,
        order: newOrder,
      });

      setModules((prev) => [...prev, newModule]);
      toast.success("Module created successfully");
      toggleCreating();
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Module creation error:", error);
    }
  };

  const onReorder = async (updateData) => {
    try {
      await reOrderModules(updateData);
      setIsUpdating(true);

      toast.success("Chapters reordered");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Reorder error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const startEdit = (module) => {
    router.push(`/dashboard/courses/${courseId}/modules/${module.id}`);
  };

  const sortedModules = modules.sort((a, b) => a.order - b.order);

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-gray-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}

      <div className="font-medium flex items-center justify-between">
        Course Modules
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating ? <>Cancel</> : <><PlusCircle className="h-4 w-4 mr-2" /> Add a module</>}
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
                      placeholder="Module Title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Create
              </Button>
            </div>
          </form>
        </Form>
      )}

      {!isCreating && (
        <div className={cn(
          "text-sm mt-2", 
          !modules?.length && "text-slate-500 italic")}>
          {!modules?.length && "No module"}
          <ModuleList items={sortedModules} onEdit={startEdit} onReorder={onReorder} />
        </div>
      )}
    </div>
  );
};
