"use client";
import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { Button, useToast } from "@chakra-ui/react";
import { useAuthStore } from "@/store/auth";
import axios from "axios";
import { Answer } from "./AnswersList";

type Props = {
  questionId: string;
  setAnswersList: React.Dispatch<
    React.SetStateAction<{
      documents: Answer[];
      total: number;
    }>
  >;
};

const AnswerQuestion = ({ questionId, setAnswersList }: Props) => {
  const [answer, setAnswer] = useState("");
  const { user, session } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // post user answer
  const postAnswer = async () => {
    if (answer === "") {
      return;
    }

    if (!session) {
      toast({
        description: "login to post an answer",
        duration: 1200,
        isClosable: true,
        status: "error",
        position: "top-right",
      });
      return;
    }

    try {
      setLoading(true);
      const result = await axios({
        url: "http://localhost:3000/api/answer",
        method: "POST",
        data: {
          questionId,
          answer,
          authorId: user?.$id,
        },
      });

      // add my answer to state
      setAnswersList((prev) => {
        return {
          documents: [
            ...prev.documents,
            {
              answerDetail: { ...result.data.res },
              upVotes: { documents: [], total: 0 },
              downVotes: { documents: [], total: 0 },
              author: {
                name: user?.name!,
                reputation: user?.prefs.reputation!,
              },
            },
          ],
          total: prev.total + 1,
        };
      });
      setAnswer("");

      toast({
        description: "answer posted succesfully",
        duration: 1200,
        isClosable: true,
        status: "success",
        position: "top-right",
      });
    } catch (error: any) {
      toast({
        description: "error in posting answer",
        duration: 1200,
        isClosable: true,
        status: "error",
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MDEditor
        value={answer}
        onChange={(value) => {
          setAnswer(value || "");
        }}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
        preview="edit"
      />
      <Button
        background="orange"
        fontWeight={"400"}
        my={"10px"}
        onClick={postAnswer}
        isLoading={loading}
      >
        Post your answer
      </Button>
    </>
  );
};

export default AnswerQuestion;
