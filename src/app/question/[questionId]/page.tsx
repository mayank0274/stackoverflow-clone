import {
  answerCollection,
  commentCollection,
  db,
  questionAttachmentBucket,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { Box, Tag, TagLabel, Text, Image, Divider } from "@chakra-ui/react";
import MDEditor from "@uiw/react-md-editor";
import React from "react";
import MarkdownPreview from "./MarkdownPreview";
import moment from "moment";
import { UserPrefs } from "@/store/auth";
import { Query } from "node-appwrite";
import { storage } from "@/models/client/config";
import AnswersList from "@/components/AnswersList";
import Vote from "@/components/Vote";
import Head from "next/head";
import Comment, { CommentCard } from "@/components/Comment";

type Props = {};

const QuestionDetails = async ({
  params,
}: {
  params: { questionId: string };
}) => {
  // get question details
  const [
    question,
    answers,
    questionUpvotes,
    questionDownvotes,
    questionComments,
  ] = await Promise.all([
    databases.getDocument(db, questionCollection, params.questionId),
    databases.listDocuments(db, answerCollection, [
      Query.orderDesc("$createdAt"),
      Query.equal("questionId", params.questionId),
      Query.limit(10),
    ]),
    databases.listDocuments(db, voteCollection, [
      Query.equal("typeId", params.questionId),
      Query.equal("type", "question"),
      Query.equal("voteStatus", "upvoted"),
      Query.limit(1), // for optimization
    ]),
    databases.listDocuments(db, voteCollection, [
      Query.equal("typeId", params.questionId),
      Query.equal("type", "question"),
      Query.equal("voteStatus", "downvoted"),
      Query.limit(1), // for optimization
    ]),
    databases.listDocuments(db, commentCollection, [
      Query.equal("typeId", params.questionId),
      Query.equal("type", "question"),
      Query.orderDesc("$createdAt"),
      Query.limit(5),
    ]),
  ]);

  console.log(questionComments);

  // gert question attachment
  const author = await users.get<UserPrefs>(question.authorId);
  let questionAttachment;
  if (question?.attachmentId != "") {
    questionAttachment = storage.getFilePreview(
      questionAttachmentBucket,
      question?.attachmentId
    );
  }

  return (
    <Box
      width={{ base: "95%", sm: "95%", md: "60%", lg: "60%" }}
      display={"flex"}
      flexDir={"column"}
      gap={"20px"}
    >
      <title>{question?.title}</title>
      <Box display={"flex"} flexDir={"column"} gap={"10px"} width={"100%"}>
        <Text fontSize={"35px"}>{question?.title}</Text>
        <Text>
          {moment(question.$updatedAt).fromNow()} &nbsp;&#8226;&nbsp; Asked by{" "}
          {author.name}
        </Text>
        <Divider color={"gray"} />
        <Box display={"flex"} gap={"10px"} width={"100%"}>
          <Vote
            type="question"
            id={question.$id}
            upvotes={questionUpvotes}
            downvotes={questionDownvotes}
          />
          <Box display={"flex"} flexDir={"column"} gap={"15px"} width={"100%"}>
            <MarkdownPreview content={question?.content} />
            {questionAttachment && (
              <Image
                src={questionAttachment?.href!}
                alt={question?.title}
                width={"100%"}
                height={"250px"}
                borderRadius={"9px"}
              />
            )}
            {question?.tags?.length > 0 && (
              <Box display={"flex"} gap={"9px"}>
                {question.tags.map((tag: string) => {
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
                })}
              </Box>
            )}
          </Box>
        </Box>
        <Divider color={"gray"} w={"95%"} alignSelf={"flex-end"} />
        {/* 
        {questionComments.documents.length > 0 && (
          <Box
            display={"flex"}
            flexDir={"column"}
            gap={"12px"}
            width={"95%"}
            alignSelf={"flex-end"}
          >
            {questionComments.documents.map((comment) => {
              return (
                <CommentCard
                  key={comment.$id}
                  content={comment.content}
                  author={comment.authorInfo[1]}
                  date={new Date(comment.$createdAt)}
                />
              );
            })}
          </Box>
        )} */}

        <Box width={"95%"} alignSelf={"flex-end"}>
          <Comment
            type="question"
            typeId={question.$id}
            comments={questionComments}
          />
        </Box>
      </Box>
      <AnswersList questionId={question.$id} answers={answers} />
    </Box>
  );
};

export default QuestionDetails;
