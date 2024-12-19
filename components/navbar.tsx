"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { ModeToggle } from "./modetoggle";
import { Notification } from "./Notification";
import { useRouter } from "next/navigation";
import { useGetUserDetailQuery } from "@/redux/service/user";
import { useState, useEffect } from "react";

export function UserNav() {
  const [userUUID, setUserUUID] = useState("");
  const { data: userData } = useGetUserDetailQuery({ uuid: userUUID });
  const router = useRouter();

  useEffect(() => {
    setUserUUID(localStorage.getItem("userUUID") || "");
  });
  console.log(localStorage.getItem("userUUID"));
  console.log(userData);


  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_LOCALHOST}logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        throw new Error(`Logout failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Data from logout:", data);

      // Assuming the logout is successful, redirect to the login page
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex justify-end items-center p-2">
      <div className="flex items-center space-x-4 px-8">
      <Notification/>
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={userData?.data?.profile}
                  alt="Avatar"
                  className="object-cover"
                />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userData?.data?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                {userData?.data?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={()=> router.push("/myProfile")}>
              <User className="mr-2 h-4 w-4" />
              <span>My profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
