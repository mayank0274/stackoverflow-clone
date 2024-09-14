"use client";
import { Box, Button, FormLabel, Input, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag,
  AutoCompleteCreatable,
} from "@choc-ui/chakra-autocomplete";
import { useAuthStore } from "@/store/auth";
import { storage, databases } from "@/models/client/config";
import {
  db,
  questionAttachmentBucket,
  questionCollection,
} from "@/models/name";
import { ID } from "node-appwrite";
import rehypeSanitize from "rehype-sanitize";

type Props = {};

function AskQuestion({}: Props) {
  const { user } = useAuthStore();
  const [questionInfo, setQuestionInfo] = useState({
    title: "",
    content: "",
    authorId: user?.$id,
    attachmentId: "",
    tags: [],
  });
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  // handle question state
  const setQuestionState = (attrName: string, value: string | string[]) => {
    setQuestionInfo((prev) => {
      return { ...prev, [attrName]: value };
    });
  };

  // submit question
  const submitQuestion = async () => {
    if (
      !questionInfo.title ||
      !questionInfo.authorId ||
      !questionInfo.content
    ) {
      toast({
        description: "title , content are required",
        duration: 1200,
        isClosable: true,
        status: "error",
        position: "top-right",
      });
      return;
    }

    try {
      setLoading(true);
      const question = await databases.createDocument(
        db,
        questionCollection,
        ID.unique(),
        questionInfo
      );
      console.log(question);
    } catch (error: any) {
      toast({
        description: error.message || "error in uploading file",
        duration: 1200,
        isClosable: true,
        status: "error",
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  // upload attachment
  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files) {
        return;
      }
      let image = e.target.files[0];
      setLoading(true);
      const res = await storage.createFile(
        questionAttachmentBucket,
        ID.unique(),
        image
      );
      setQuestionState("attachmentId", res.$id);
    } catch (error: any) {
      toast({
        description: error.message || "error in uploading file",
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
    <Box
      width={{ base: "95%", sm: "95%", md: "60%", lg: "60%" }}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDir={"column"}
      gap={"25px"}
      my={"20px"}
    >
      <Box width={"70%"}>
        <FormLabel as={"label"}>Title</FormLabel>
        <Input
          value={questionInfo.title}
          as="input"
          type="text"
          id="title"
          name="title"
          background={"#0d1117"}
          outline={"none"}
          placeholder="enter question title"
          onChange={(e) => {
            setQuestionState("title", e.target.value);
          }}
        />
      </Box>

      <Box width={"70%"}>
        <FormLabel as={"label"}>Description</FormLabel>
        <MDEditor
          value={questionInfo.content}
          onChange={(value) => {
            setQuestionState("content", value || "");
          }}
          previewOptions={{
            rehypePlugins: [[rehypeSanitize]],
          }}
          preview="edit"
        />
      </Box>

      <Box width={"70%"}>
        <FormLabel as={"label"}>Attachment</FormLabel>
        <input
          type="file"
          style={{
            background: "#0d1117",
            width: "100%",
            padding: "9px",
            borderRadius: "5px",
          }}
          onChange={uploadFile}
        />
      </Box>

      <Box width={"70%"}>
        <FormLabel as={"label"}>Tags</FormLabel>
        <AutoComplete
          openOnFocus
          multiple
          onChange={(vals: string[]) => setQuestionState("tags", vals)}
          creatable
          style={{ background: "#0d1117" }}
        >
          <AutoCompleteInput
            variant="filled"
            style={{ background: "#0d1117" }}
            placeholder="enter tags"
          >
            {({ tags }) =>
              tags.map((tag, tid) => (
                <AutoCompleteTag
                  key={tid}
                  label={tag.label}
                  onRemove={tag.onRemove}
                />
              ))
            }
          </AutoCompleteInput>
          <AutoCompleteList style={{ background: "#0d1117" }}>
            <AutoCompleteCreatable />
          </AutoCompleteList>
        </AutoComplete>
      </Box>

      <Button
        width={"70%"}
        background={"orange"}
        onClick={submitQuestion}
        isLoading={loading}
      >
        Submit question
      </Button>
    </Box>
  );
}

export default AskQuestion;
