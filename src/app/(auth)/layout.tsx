"use client";
import { useAuthStore } from "@/store/auth";
import { Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { session, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push(`/profile/${user?.$id}`);
    }
  }, [session, router]);

  return (
    <Box
      width={"100%"}
      height="100vh"
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      {children}
    </Box>
  );
};

export default Layout;
