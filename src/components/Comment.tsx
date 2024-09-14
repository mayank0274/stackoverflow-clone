"use client";
import { databases } from "@/models/client/config";
import { commentCollection, db } from "@/models/name";
import { useAuthStore } from "@/store/auth";
import { Box, Button, Divider, Input, Text, useToast } from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { ID, Models, Query } from "node-appwrite";
import React, { useState } from "react";

type Props = {
  type: "answer" | "question";
  typeId: string;
  comments: Models.DocumentList<Models.Document>;
};

type CommentCardProps = {
  author: string;
  content: string;
  date: Date;
};

export const CommentCard = ({ author, content, date }: CommentCardProps) => {
  return (
    <Box>
      <Text fontSize={"16px"}>
        {content} -{" "}
        <Text as={"span"} color={"#ffa600"} fontSize={"13px"}>
          {author}
        </Text>
        <Text as={"span"} color={"#ffa600"} fontSize={"10px"}>
          &nbsp; (on {moment(date).format("DD MMM,YYYY hh:mm a")})
        </Text>
      </Text>
      <Divider color={"gray"} my={"9px"} />
    </Box>
  );
};

const Comment = ({ type, typeId, comments }: Props) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentsList, setCommentsList] = useState(comments);
  const [content, setContent] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();
  const toast = useToast();

  // toggle comment show hide
  const toggleCommentBox = () => {
    setShowCommentBox((prev) => {
      return !prev;
    });
  };

  // post comment
  const postComment = async () => {
    if (content === "") {
      return;
    }

    if (!user) {
      router.push("/login");
    }

    try {
      const res = await databases.createDocument(
        db,
        commentCollection,
        ID.unique(),
        {
          type,
          typeId,
          content,
          authorInfo: [user?.$id, user?.name],
        }
      );

      setIsSuccess(true);

      toast({
        description: "comment posted succesfully",
        duration: 1200,
        isClosable: true,
        status: "success",
        position: "top-right",
      });
    } catch (error: any) {
      toast({
        description: error.message || "error in posting comment",
        duration: 1200,
        isClosable: true,
        status: "error",
        position: "top-right",
      });
    } finally {
      //   setIsSuccess(false);
    }
  };

  // comment pagination
  const loadMoreComments = async () => {
    try {
      const lastDocId =
        commentsList.documents[commentsList.documents.length - 1].$id;

      const res = await databases.listDocuments(db, commentCollection, [
        Query.limit(5),
        Query.equal("typeId", typeId),
        Query.equal("type", type),
        Query.cursorAfter(lastDocId),
        Query.orderDesc("$createdAt"),
      ]);

      setCommentsList((prev) => {
        let newData = {
          total: prev.total,
          documents: [...prev.documents, ...res.documents],
        };
        return newData;
      });
    } catch (error: any) {
      toast({
        description: error.message || "error in loading comment",
        duration: 1200,
        isClosable: true,
        status: "error",
        position: "top-right",
      });
    }
  };

  return (
    <Box display={"flex"} flexDir={"column"} gap={"10px"} width={"100%"}>
      {commentsList?.documents?.length > 0 && (
        <Box
          display={"flex"}
          flexDir={"column"}
          gap={"12px"}
          width={"100%"}
          alignSelf={"flex-end"}
        >
          {commentsList?.documents.map((comment) => {
            return (
              <CommentCard
                key={comment.$id}
                content={comment.content}
                author={comment.authorInfo[1]}
                date={new Date(comment.$createdAt)}
              />
            );
          })}

          <Text fontSize={"12px"} role="button" onClick={loadMoreComments}>
            Show more
          </Text>
        </Box>
      )}

      {isSuccess && (
        <CommentCard content={content} author={user?.name!} date={new Date()} />
      )}
      <Text role="button" onClick={toggleCommentBox}>
        Add comment
      </Text>
      {showCommentBox && (
        <Box display={"flex"} gap={"10px"} width={"100%"}>
          <Input
            type="text"
            size={"sm"}
            borderRadius={"5px"}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
          <Button fontWeight={"400"} size={"sm"} onClick={postComment}>
            Add
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Comment;
