"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { VideoPlayer } from "@/components/video-player";
import { formatDuration } from "@/lib/date";
import { updateVideoUrl } from "@/app/action/lesson";

// Form validation schema
const formSchema = z.object({
  url: z.string().min(1, {
    message: "Required",
  }),
  duration: z.string().min(1, {
    message: "Required",
  }),
});

export const VideoUrlForm = ({ initialData, courseId, lessonId }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  // Local state for video URL and duration
  const [state, setState] = useState({
    url: initialData?.url,
    duration: formatDuration(initialData?.duration),
  });

  const toggleEdit = () => setIsEditing((current) => !current);

  // Form setup using react-hook-form and zod
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  // Handle form submission to update video URL and duration
  const onSubmit = async (values) => {
    try {
      const payload = {};
      payload["video_url"] = values?.url;
      const duration = values?.duration;
      const splitted = duration.split(":");

      // Ensure the duration format is hh:mm:ss
      if (splitted.length === 3) {
        payload["duration"] = splitted[0] * 3600 + splitted[1] * 60 + splitted[2] * 1;

        // Call action to update video URL and duration
        const res = await updateVideoUrl(lessonId, payload["video_url"], payload["duration"]);
        if (res.success) {
          // Update local state with new values
          setState({
            url: payload["video_url"],
            duration: formatDuration(payload["duration"]),
          });

          toast.success("Lesson updated");
          toggleEdit();
          
          // Refresh the page (if needed, you can remove this if state update is enough)
          router.refresh(); 
        } else {
          throw new Error(res.message);
        }
      } else {
        toast.error("The duration format must be as hh:mm:ss");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Video URL
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit URL
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          <p className="text-sm mt-2">{state?.url}</p>
          <div className="mt-6">
            <VideoPlayer url={state?.url} />
          </div>
        </>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* Video URL Field */}
            <FormField control={form.control} name="url" render={({ field }) => (
              <FormItem>
                <FormLabel>Video URL</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="e.g. 'Introduction to the course'"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {/* Video Duration Field */}
            <FormField control={form.control} name="duration" render={({ field }) => (
              <FormItem>
                <FormLabel>Video Duration</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="e.g. '10:30:18'"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
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
