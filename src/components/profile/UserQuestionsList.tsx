import { databases } from "@/models/server/config";
import { db, questionCollection } from "@/models/name";
import { Box, Tag, TagLabel, Text } from "@chakra-ui/react";
import { Models } from "appwrite";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";

type Props = {
  userId: string;
};

type Question = Models.Document;

export const QuestionCard = ({ question }: { question: Question }) => {
  return (
    <Link href={`/question/${question.$id}`}>
      <Box
        background={"rgb(112,119,161,0.3)"}
        padding={"10px"}
        borderRadius={5}
        width={"100%"}
        display={"flex"}
        flexDir={"column"}
        gap={"4px"}
      >
        <Text fontWeight={"semibold"} fontSize={"18px"}>
          {question.title}
        </Text>
        <Text fontSize={"14px"} noOfLines={1}>
          {question.content.split("```")[0]}
        </Text>
        {question?.tags?.length > 0 && (
          <Box display={"flex"} gap={"9px"}>
            {question.tags.map((tag: string) => {
              if (tag) {
                return (
                  <Tag
                    size={"md"}
                    key={tag}
                    variant="outline"
                    colorScheme="blue"
                  >
                    <TagLabel>{tag}</TagLabel>
                  </Tag>
                );
              }
            })}
          </Box>
        )}
      </Box>
    </Link>
  );
};

const UserQuestionsList = async ({ userId }: Props) => {
  const { documents } = await databases.listDocuments(db, questionCollection, [
    Query.equal("authorId", userId),
    Query.orderDesc("$createdAt"),
  ]);

  return (
    <Box width={"100%"}>
      {documents.length === 0 ? (
        <Text>
          No question asked by you{" "}
          <Link
            href={"/ask-question"}
            style={{ textDecoration: "underline", color: "orange" }}
          >
            Click here to ask one
          </Link>
        </Text>
      ) : (
        <Box display={"flex"} flexDir={"column"} gap={"10px"}>
          {documents.map((question: Question) => {
            return <QuestionCard question={question} key={question.$id} />;
          })}
        </Box>
      )}
    </Box>
  );
};

export default UserQuestionsList;
