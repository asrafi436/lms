"use client";

import { Logo } from "@/components/logo";
import { MobileSidebar } from "./mobile-sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export const Navbar = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    let isMounted = true; // Prevent setting state if component unmounts

    async function fetchMe() {
      try {
        const response = await fetch("/api/me");
        if (!response.ok) throw new Error("Failed to fetch user");
        const data = await response.json();
        
        if (isMounted) {
          setLoggedInUser(data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }

    fetchMe();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, []);

  // Extract first name, last name, and profile picture
  const firstName = loggedInUser?.first_name || "User";
  const lastName = loggedInUser?.last_name || "";
  const profilePic = loggedInUser?.profile_picture || "/default-avatar.png";

  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <div className="flex items-center justify-end w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={profilePic} alt="User Avatar" />
                <AvatarFallback>
                  {firstName.charAt(0)}
                  {lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {firstName} {lastName}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-4 bg-white">
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/account">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-500" onClick={() => signOut()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
