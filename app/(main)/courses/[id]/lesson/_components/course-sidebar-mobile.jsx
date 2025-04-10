import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Menu } from "lucide-react";
import { CourseSidebar } from "./course-sidebar";

export const CourseSidebarMobile = async ({courseId, module, userId,reports}) => {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-72">
        <CourseSidebar courseId={courseId} module={module} userId={userId} reports={reports}/>
      </SheetContent>
    </Sheet>
  );
};
