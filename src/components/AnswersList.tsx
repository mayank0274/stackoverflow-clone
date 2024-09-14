"use client";
import {
  Box,
  Button,
  Divider,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Vote from "./Vote";
import MarkdownPreview from "@/app/question/[questionId]/MarkdownPreview";
import AnswerQuestion from "./AnswerQuestion";
import { Models } from "appwrite";
import { databases } from "@/models/client/config";
import { answerCollection, db, voteCollection } from "@/models/name";
import { Query } from "node-appwrite";
import moment from "moment";
import Comment from "./Comment";

type Props = {
  questionId: string;
  answers: Models.DocumentList<Models.Document>;
};

export interface Answer {
  answerDetail: Models.Document;
  upVotes: Models.DocumentList<Models.Document>;
  downVotes: Models.DocumentList<Models.Document>;
  author: {
    name: string;
    reputation: number;
  };
}

const AnswersList = ({ questionId, answers }: Props) => {
  const [answersList, setAnswersList] = useState<{
    documents: Answer[];
    total: number;
  }>({
    documents: [],
    total: 0,
  });
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // fetch answer votes,coments
  const fetchAnswerDetails = async (
    answers: Models.DocumentList<Models.Document>
  ) => {
    try {
      let answersWithDetails: Answer[] = [];

      setIsLoading(true);

      // ftech details for each answer
      for (let i = 0; i < answers.documents.length; i++) {
        let target = answers.documents[i];
        const res = await fetch(`/api/user-detail?userId=${target.authorId}`);
        const author = await res.json();
        const [upVotes, downVotes] = await Promise.all([
          databases.listDocuments(db, voteCollection, [
            Query.equal("typeId", target.$id),
            Query.equal("type", "answer"),
            Query.equal("voteStatus", "upvoted"),
            Query.limit(1), // for optimization
          ]),
          databases.listDocuments(db, voteCollection, [
            Query.equal("typeId", target.$id),
            Query.equal("type", "answer"),
            Query.equal("voteStatus", "downvoted"),
            Query.limit(1), // for optimization
          ]),
        ]);

        // add answer with details like comments,votes to list
        answersWithDetails.push({
          answerDetail: { ...target },
          upVotes,
          downVotes,
          author,
        });
      }

      return answersWithDetails;
    } catch (error: any) {
      toast({
        description: error.message || "error in fetching answer details",
        duration: 1200,
        isClosable: true,
        status: "error",
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // set answerlist on first render
  useEffect(() => {
    (async () => {
      let answersWithDetails = await fetchAnswerDetails(answers);
      // add to state
      setAnswersList((prev) => {
        return {
          documents: answersWithDetails!,
          total: answersWithDetails?.length!,
        };
      });
    })();
  }, []);

  // fetch more answers
  const loadMoreAnswers = async () => {
    try {
      const lastDocID =
        answersList.documents[answersList.documents.length - 1].answerDetail
          .$id;
      const res = await databases.listDocuments(db, answerCollection, [
        Query.cursorAfter(lastDocID),
        Query.orderDesc("$createdAt"),
        Query.equal("questionId", questionId),
        Query.limit(10),
      ]);

      if (res.documents.length > 0) {
        const ans = await fetchAnswerDetails(res);
        setAnswersList((prev) => {
          return {
            total: prev.total + ans!.length,
            documents: [...prev.documents],
            ...ans!,
          };
        });
      }
    } catch (error) {}
  };

  return (
    <Box width={"100%"} display={"flex"} flexDir={"column"} gap={"2px"}>
      <Text fontSize={"23px"}>{answersList.total} Answers</Text>
      <Text role="button" onClick={loadMoreAnswers} fontSize={"13px"}>
        Show more
      </Text>
      <Text fontSize={"15px"}>{isLoading && "loading..."}</Text>

      <Box
        display={"flex"}
        flexDir={"column"}
        gap={"10px"}
        width={"100%"}
        my={"20px"}
      >
        {answersList.documents.reverse().map((answer) => {
          return (
            <Box
              width={"100%"}
              display={"flex"}
              flexDir={"column"}
              gap={"10px"}
              key={answer.answerDetail.$id}
            >
              <Box display={"flex"} gap={"10px"} width={"100%"}>
                <Vote
                  type="answer"
                  id={answer.answerDetail.$id}
                  upvotes={answer?.upVotes}
                  downvotes={answer?.downVotes}
                />
                <MarkdownPreview content={answer?.answerDetail.content} />
              </Box>

              <Box
                alignSelf={"flex-end"}
                display={"flex"}
                justifyContent={"space-between"}
                width={"95%"}
              >
                <Box alignSelf={"flex-start"} display={"inline"}>
                  {/* <Comment type="answer" typeId={answer.answerDetail.$id} /> */}
                </Box>

                <Box display={"flex"} flexDir={"column"} gap={"2px"}>
                  <Text fontSize={"12px"}>
                    answered {moment(answer.answerDetail.$createdAt).fromNow()}{" "}
                    by
                  </Text>
                  <Box display={"flex"} gap={"10px"}>
                    <Box
                      background={"#FFCB72"}
                      height={"35px"}
                      width={"35px"}
                      borderRadius={"10px"}
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      fontSize={"18px"}
                    >
                      <Text>
                        {answer.author?.name.split(" ")[0][0]}
                        {answer.author?.name.split(" ")[1] &&
                          answer.author?.name.split(" ")[1][0]}
                      </Text>
                    </Box>
                    <Box
                      display={"flex"}
                      flexDir={"column"}
                      title="name . reputation"
                    >
                      <Text fontSize={"13px"}>{answer.author?.name}</Text>
                      <Text fontSize={"12px"}>{answer.author.reputation}</Text>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Divider color={"gray"} />
            </Box>
          );
        })}
      </Box>

      <Box>
        <AnswerQuestion
          questionId={questionId}
          setAnswersList={setAnswersList}
        />
      </Box>
    </Box>
  );
};

export default AnswersList;
