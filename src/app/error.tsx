"use client";
import { Box, Center, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

type Props = {};

const error = (props: Props) => {
  return (
    <Box>
      <Center
        h={"85vh"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        gap={"12px"}
      >
        <Text>Page you are looking not found or something went wrong</Text>
        <Link
          href={"/"}
          prefetch
          style={{
            color: "orange",
          }}
        >
          Go to home
        </Link>
      </Center>
    </Box>
  );
};

export default error;
