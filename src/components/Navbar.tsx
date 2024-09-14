"use client";
import { Box, Text, ButtonGroup, Button } from "@chakra-ui/react";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

type Props = {};

const Navbar = (props: Props) => {
  const { session, user, logout } = useAuthStore();
  const router = useRouter();

  async function logoutUser() {
    try {
      const { success } = await logout();

      if (success) {
        router.push("/");
      }
    } catch (error) {}
  }
  return (
    <Box
      width={{ base: "95%", sm: "95%", md: "60%", lg: "60%" }}
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Text fontSize={"20px"} fontStyle={"italic"}>
        stackoverflow
      </Text>
      <Box display={"flex"} gap={"25px"} alignItems={"center"}>
        <Link href={"/"}>Home</Link>

        <ButtonGroup size={"sm"}>
          {session ? (
            <Box display={"flex"} gap={"20px"} alignItems={"center"}>
              <Link href={`/profile/${user?.$id}`}>Profile</Link>
              <Link href={"/ask-question"}>
                <Button background={"orange"}>Ask Question</Button>
              </Link>
              <Button onClick={logoutUser} colorScheme="red">
                Logout
              </Button>
            </Box>
          ) : (
            <>
              {" "}
              <Link href={"/login"}>
                {" "}
                <Button fontWeight={"semibold"}>Login</Button>
              </Link>
              <Link href={"/register"}>
                <Button fontWeight={"semibold"}>Signup</Button>
              </Link>
            </>
          )}
        </ButtonGroup>
      </Box>
    </Box>
  );
};

export default Navbar;
