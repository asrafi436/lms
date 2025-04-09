'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { PlayCircle } from "lucide-react";
import { Lock } from "lucide-react";
import Link from "next/link";
import { SidebarLessons } from "./sidebar-lessons";
import { useEffect, useState } from 'react';


export const SidebarModules = ({ courseId, module }) => {

  const [loadedModule, setLoadedModule] = useState(null);


  // console.log("Course ID is:", courseId);
  // console.log("Fetched modules with lessons by course wise:", module);
  // console.log("Type of module:", typeof module); // Check type
  // console.log("Is module an array?", Array.isArray(module)); // Check if it's an array

  useEffect(() => {
    // Assuming `module` is being passed as a prop or fetched
    if (module && module.length > 0) {
      setLoadedModule(module);
      console.log("Fetched modules with lessons by course wise:", module);
    }
  }, [module]); // Only log when module changes

  if (!loadedModule) {
    return <div>Loading...</div>; // Or any loading component
  }


  return (
    <Accordion
      defaultValue="item-1"
      type="single"
      collapsible
      className="w-full px-6"
    >
      {/* item */}
      {
        <AccordionItem className="border-0" value="item-1">
          {loadedModule.map((moduleItem, index) => {
            const status = parseInt(moduleItem.module_status); // Ensure module_status is treated as a number

            console.log('Module Status:', status); // Debug log to check the module status

            // If the module status is not 1, don't render the module
            if (status !== 1) {
              return null; // Skip rendering this module if status is not 1
            }

            return (
              <AccordionItem key={moduleItem.module_id} className="border-0" value={`item-${index}`}>
                <AccordionTrigger>{moduleItem.module_title} {moduleItem.module_status}</AccordionTrigger>
                <SidebarLessons lessons={moduleItem.lessons} courseId={courseId} />
              </AccordionItem>
            );
          })}

        </AccordionItem>

      }
      {/* item ends */}


    </Accordion>
  )

}