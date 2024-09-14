import { databases } from "@/models/server/config";
import { answerCollection, db, questionCollection } from "@/models/name";
import { Box, Text } from "@chakra-ui/react";
import { Models } from "appwrite";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";

type Props = {
  userId: string;
};

type Answer = Models.Document;

const AnswerCard = ({ answer }: { answer: Answer }) => {
  return (
    <Link href={`/question/${answer.questionId}`}>
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
          {answer?.question.title}
        </Text>
        <Text fontSize={"14px"} noOfLines={1}>
          {answer.content.split("```")[0]}
        </Text>
      </Box>
    </Link>
  );
};

const UserAnswersList = async ({ userId }: Props) => {
  const answers = await databases.listDocuments(db, answerCollection, [
    Query.equal("authorId", userId),
    Query.orderDesc("$createdAt"),
  ]);

  answers.documents = await Promise.all(
    answers.documents.map(async (ans) => {
      const question = await databases.getDocument(
        db,
        questionCollection,
        ans.questionId,
        [Query.select(["title"])]
      );
      return { ...ans, question };
    })
  );

  return (
    <Box width={"100%"}>
      {answers.documents.length === 0 ? (
        <Text>
          No answer given you{" "}
          <Link
            href={"/ask-question"}
            style={{ textDecoration: "underline", color: "orange" }}
          >
            Click here to explore questions
          </Link>
        </Text>
      ) : (
        <Box display={"flex"} flexDir={"column"} gap={"10px"}>
          {answers.documents.map((answer: Answer) => {
            return <AnswerCard answer={answer} key={answer.$id} />;
          })}
        </Box>
      )}
    </Box>
  );
};

export default UserAnswersList;
