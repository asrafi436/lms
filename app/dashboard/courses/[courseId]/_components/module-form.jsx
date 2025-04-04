"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2, PlusCircle, Save, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ModuleList } from "./module-list";
import { createCourseModule, updateTitle, reOrderModules  } from "@/app/action/module"; // Updated import

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const ModulesForm = ({ initialData, courseId }) => {
  const [modules, setModules] = useState(initialData || []);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editModuleId, setEditModuleId] = useState(null);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleCreating = () => {
    setIsCreating((curr) => !curr);
    setEditModuleId(null);
  };

  const onSubmit = async (values) => {
    try {
      if (!courseId) {
        toast.error("Invalid course ID");
        return;
      }

      const newModule = await createCourseModule(courseId, values);

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

  const onEditSubmit = async (id, values) => {
    try {
      setIsUpdating(true);
      const res = await updateTitle(id, values.title);

      if (!res.success) {
        throw new Error(res.message);
      }

      const updatedModules = modules.map((mod) =>
        mod.id === id ? { ...mod, title: values.title } : mod
      );
      setModules(updatedModules);
      toast.success("Module updated successfully");
      setEditModuleId(null);
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error("Failed to update module");
      console.error("Module update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const startEdit = (module) => {
    form.setValue("title", module.title);
    setEditModuleId(module.id);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditModuleId(null);
    form.reset();
  };

  // const onReorder = async (updateData) => {
  //   console.log({ updateData });
  //   try {
  //     reOrderModules(updateData);
  //     setIsUpdating(true);

  //     toast.success("Chapters reordered");
  //     router.refresh();
  //   } catch {
  //     toast.error("Something went wrong");
  //   } finally {
  //     setIsUpdating(false);
  //   }

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

      {(isCreating || editModuleId) && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              editModuleId ? onEditSubmit(editModuleId, values) : onSubmit(values)
            )}
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
                {editModuleId ? (
                  <>
                    <Save className="h-4 w-4 mr-2" /> Save
                  </>
                ) : (
                  "Create"
                )}
              </Button>
              {editModuleId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelEdit}
                  disabled={isSubmitting}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      )}

      {!isCreating && !editModuleId && (
        <div className={cn("text-sm mt-2", !modules?.length && "text-slate-500 italic")}>
          {!modules?.length && "No module"}
          <ModuleList items={modules} onEdit={startEdit} onReorder={onReorder}/>
        </div>
      )}
    </div>
  );
};
