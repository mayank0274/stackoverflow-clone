import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import { Box, Text } from "@chakra-ui/react";
import { Query } from "node-appwrite";
import AllQuestions from "./AllQuestions";
import Image from "next/image";

export default async function Home() {
  let questions = await databases.listDocuments(db, questionCollection, [
    Query.orderAsc("$createdAt"),
    Query.limit(15),
  ]);

  return (
    <Box
      width={"100%"}
      as="main"
      display={"flex"}
      flexDir={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={"10px"}
    >
      <Box
        display={"flex"}
        flexDir={"column"}
        gap={"6px"}
        justifyContent={"center"}
        alignItems={"center"}
        fontFamily={"Merriweather Sans Variable"}
      >
        <Text fontSize={"50px"}>
          Code with{" "}
          <Text as={"span"} color={"orange"}>
            Confidence ,
          </Text>
        </Text>
        <Text fontSize={"35px"}>
          Backed by{" "}
          <Text as={"span"} color={"orange"}>
            Community
          </Text>
        </Text>
      </Box>

      <Image
        src={"/heroSection.png"}
        alt="heroSection"
        width={870}
        height={750}
        priority
        style={{
          border: "3px solid grey",
          borderRadius: "10px",
        }}
      />

      <AllQuestions questions={questions} />
    </Box>
  );
}
