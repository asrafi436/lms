"use client";

import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { changeModulePublishState, deleteModule } from "@/app/action/module";
import { toast } from "sonner";

export const ModuleActions = ({ module, courseId }) => {
  const [published, setPublished] = useState(module?.status); // 0 or 1
  const [loading, setLoading] = useState(false);

  console.log("Module status: ", module);


//   useEffect(() => {
//     setPublished(module?.status); // Re-sync the component state with the updated module status
//   }, [module?.status]);

  const handlePublishChange = async () => {
    setLoading(true);
    try {
      const newState = published === 1 ? 0 : 1;
      const updatedState = await changeModulePublishState(module.id, newState); // Update the state from the backend
      setPublished(updatedState); // Update the UI state to match the database
      toast.success(`Module ${newState === 1 ? "published" : "unpublished"}`);
    } catch (e) {
      toast.error(e.message || "Failed to change module publish state");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (published === 1) {
      toast.error("Unpublish the module before deleting.");
      return;
    }

    setLoading(true);
    try {
      await deleteModule(module.id);
      toast.success("Module deleted successfully");
      // Refresh the page or redirect after successful deletion
      window.location.href = `/dashboard/courses/${courseId}`;
    } catch (e) {
      toast.error(e.message || "Failed to delete module");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePublishChange}
        disabled={loading}
      >
        {published === 1 ? "Unpublish" : "Publish"}
      </Button>

      <Button
        size="sm"
        onClick={handleDelete}
        disabled={loading}
        variant="destructive"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
