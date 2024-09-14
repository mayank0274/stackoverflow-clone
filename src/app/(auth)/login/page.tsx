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

const Login: React.FC<Props> = () => {
  // show hide password
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const toast = useToast();
  const { login } = useAuthStore();

  // hnadle show/hide password
  const handlePwd = (): void => {
    setShowPwd((prev) => {
      return !prev;
    });
  };

  // handle submit
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | null,
    isGuest = false
  ) => {
    e?.preventDefault();
    const form = new FormData(e?.currentTarget);
    let email = form.get("email");
    let password = form.get("password");

    if (isGuest) {
      email = process.env.NEXT_PUBLIC_GUEST_EMAIL!;
      password = process.env.NEXT_PUBLIC_GUEST_PASSWORD!;

      alert(email);
    }

    if (!password || !email) {
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

    const res = await login(String(email), password.toString());

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
        description: "login successfully",
        position: "top-right",
        duration: 1500,
        isClosable: true,
        status: "success",
      });
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
        Login to use stackoverflow
      </Heading>
      <form
        style={{
          width: "30%",
        }}
        onSubmit={handleSubmit}
      >
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
            background="orange"
            my={"20px"}
            width={"100%"}
            type="submit"
            isLoading={isLoading}
          >
            Login
          </Button>
          <Button
            background="orange"
            my={"2px"}
            width={"100%"}
            onClick={() => handleSubmit(null, true)}
            isLoading={isLoading}
          >
            Login as guest user
          </Button>

          <Text textAlign={"center"}>
            Not have account ?{" "}
            <Text
              as={"span"}
              color={"orange"}
              textDecoration={"underline"}
              textUnderlineOffset={2}
            >
              <Link href={"/register"}>click here to signup</Link>
            </Text>
          </Text>
        </Box>
      </form>
    </Box>
  );
};

export default Login;
