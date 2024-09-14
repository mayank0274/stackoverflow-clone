"use client";
import React from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/react";
import { Models } from "node-appwrite";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { databases } from "@/models/client/config";
import { db, voteCollection } from "@/models/name";
import { Query } from "appwrite";

type Props = {
  type: "question" | "answer";
  id: string;
  upvotes: Models.DocumentList<Models.Document>;
  downvotes: Models.DocumentList<Models.Document>;
};

const Vote = ({ type, id, upvotes, downvotes }: Props) => {
  const [votedDocument, setVotedDocument] =
    React.useState<Models.Document | null>(); // undefined means not fetched yet
  const [voteResult, setVoteResult] = React.useState<number>(
    upvotes.total - downvotes.total
  );

  const { user } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      if (user) {
        const response = await databases.listDocuments(db, voteCollection, [
          Query.equal("type", type),
          Query.equal("typeId", id),
          Query.equal("votedById", user.$id),
        ]);
        setVotedDocument(() => response.documents[0] || null);
      }
    })();
  }, [user, id, type]);

  const toggleUpvote = async () => {
    if (!user) return router.push("/login");

    if (votedDocument === undefined) return;

    try {
      const response = await fetch(`/api/vote`, {
        method: "POST",
        body: JSON.stringify({
          votedById: user.$id,
          voteStatus: "upvoted",
          type,
          typeId: id,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw data;

      setVoteResult(() => data.data.voteResult);
      setVotedDocument(() => data.data.document);
    } catch (error: any) {
      window.alert(error?.message || "Something went wrong");
    }
  };

  const toggleDownvote = async () => {
    if (!user) return router.push("/login");

    if (votedDocument === undefined) return;

    try {
      const response = await fetch(`/api/vote`, {
        method: "POST",
        body: JSON.stringify({
          votedById: user.$id,
          voteStatus: "downvoted",
          type,
          typeId: id,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw data;

      setVoteResult(() => data.data.voteResult);
      setVotedDocument(() => data.data.document);
    } catch (error: any) {
      window.alert(error?.message || "Something went wrong");
    }
  };

  return (
    <Box
      display={"flex"}
      flexDir={"column"}
      gap={"6px"}
      // justifyContent={"center"}
      width={"max-content"}
    >
      <Box
        border={"1px solid #fff"}
        borderRadius={"50%"}
        padding={"10px"}
        width={"30px"}
        height={"30px"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        cursor={"pointer"}
        title="upvote"
        background={
          votedDocument && votedDocument.voteStatus === "upvoted"
            ? "#ffa6007e"
            : "transparent"
        }
        onClick={toggleUpvote}
      >
        <ChevronUpIcon boxSize={6} />
      </Box>
      <Text textAlign={"center"}>{voteResult}</Text>
      <Box
        border={"1px solid #fff"}
        borderRadius={"50%"}
        padding={"10px"}
        width={"30px"}
        height={"30px"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        cursor={"pointer"}
        title="downvote"
        background={
          votedDocument && votedDocument.voteStatus === "downvoted"
            ? "#ffa6007e"
            : "transparent"
        }
        onClick={toggleDownvote}
      >
        <ChevronDownIcon boxSize={6} />
      </Box>
    </Box>
  );
};

export default Vote;
