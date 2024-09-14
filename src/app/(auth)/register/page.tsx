"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Input,
  InputRightElement,
  InputGroup,
  FormLabel,
  Heading,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

type Props = {};

const Signup: React.FC<Props> = () => {
  // show hide password
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const toast = useToast();
  const { createAccount } = useAuthStore();

  // hnadle show/hide password
  const handlePwd = (): void => {
    setShowPwd((prev) => {
      return !prev;
    });
  };

  // handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name");
    const email = form.get("email");
    const password = form.get("password");

    if (!name || !password || !email) {
      toast({
        description: "All fields are required",
        position: "top-right",
        duration: 1500,
        isClosable: true,
        status: "error",
      });
      return;
    }

    setLoading(true);

    const res = await createAccount(
      String(name),
      String(email),
      String(password)
    );

    if (res.error) {
      toast({
        description: res.error.message,
        position: "top-right",
        duration: 1500,
        isClosable: true,
        status: "error",
      });
    } else {
      toast({
        description: "Account created successfully",
        position: "top-right",
        duration: 1500,
        isClosable: true,
        status: "success",
      });
      router.push("/login");
    }

    setLoading(false);
  };

  return (
    <Box
      width="100%"
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDir={"column"}
      gap={"25px"}
      my={"20px"}
    >
      <Heading textAlign={"center"} fontWeight={"semibold"}>
        Signup to use stackoverflow
      </Heading>
      <form
        style={{
          width: "30%",
        }}
        onSubmit={handleSubmit}
      >
        <Box>
          <FormLabel>Name</FormLabel>
          <Input
            as="input"
            type="text"
            id="name"
            name="name"
            border={"1px solid"}
          />
        </Box>

        <Box my={"15px"}>
          <FormLabel>Email</FormLabel>
          <Input
            as="input"
            type="email"
            id="email"
            name="email"
            border={"1px solid"}
          />
        </Box>

        <Box my={"15px"}>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              as="input"
              type={showPwd ? "text" : "password"}
              id="password"
              name="password"
              border={"1px solid"}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handlePwd}>
                {showPwd ? "hide" : "show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          <Button
            background={"orange"}
            my={"20px"}
            width={"100%"}
            type="submit"
            isLoading={isLoading}
          >
            Signup
          </Button>

          <Text textAlign={"center"}>
            Already have account ?{" "}
            <Text
              as={"span"}
              color={"orange"}
              textDecoration={"underline"}
              textUnderlineOffset={2}
            >
              <Link href={"/login"}>click here to login</Link>
            </Text>
          </Text>
        </Box>
      </form>
    </Box>
  );
};

export default Signup;
