"use client";
import React, { useState } from "react";
import {
  Text,
  Box,
  Button,
  Input,
  useToast,
  InputRightElement,
  Spinner,
  InputGroup,
} from "@chakra-ui/react";
import { Models, Query } from "node-appwrite";
import { QuestionCard } from "@/components/profile/UserQuestionsList";
import { databases } from "@/models/client/config";
import { db, questionCollection } from "@/models/name";
import { debounce } from "@/utils/utilityFn";

type Props = {
  questions: Models.DocumentList<Models.Document>;
};

const AllQuestions = ({ questions }: Props) => {
  const [questionsList, setQuestionsList] = useState(questions);
  const [isSearching, setIsSearching] = useState(false);
  const toast = useToast();

  // search query from db
  const search = async (query: string) => {
    if (query === "") {
      setQuestionsList(questions);
      return;
    }

    try {
      setIsSearching(true);

      const res = await databases.listDocuments(db, questionCollection, [
        Query.or([
          Query.search("title", query),
          Query.search("content", query),
        ]),
      ]);

      if (res.total === 0) {
        toast({
          description: "No result found based on your query",
          duration: 1200,
          isClosable: true,
          status: "info",
          position: "top-right",
        });
        return;
      }

      setQuestionsList(res);
    } catch (error: any) {
      toast({
        description: error.message || "error in searching questions",
        duration: 1200,
        isClosable: true,
        status: "error",
        position: "top-right",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // handle search query change
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await search(e.target.value);
  };

  return (
    <Box
      width={"80%"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDir={"column"}
      gap={"12px"}
    >
      <Text fontSize={"27px"}>Top questions</Text>
      <InputGroup width={"70%"}>
        <Input
          type="search"
          width={"100%"}
          bg={"#0d1117ff"}
          color={"#fff"}
          placeholder="search topics/questions here"
          onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e);
          })}
        />
        {isSearching && (
          <InputRightElement>
            <Spinner size={"sm"} />
          </InputRightElement>
        )}
      </InputGroup>
      <Box display={"flex"} flexDir={"column"} gap={"10px"} width={"70%"}>
        {questionsList.documents.length > 0 &&
          questionsList.documents.map((question) => {
            return <QuestionCard question={question} key={question.$id} />;
          })}
      </Box>
    </Box>
  );
};

export default AllQuestions;
