import { UserPrefs } from "@/store/auth";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { databases } from "@/models/client/config";
import { answerCollection, db, questionCollection } from "@/models/name";
import { Query } from "appwrite";
import { users } from "@/models/server/config";
import ProfileTabs from "@/components/profile/ProfileTabs";

type StatProps = {
  title: string;
  value: number;
};

const StatCard = ({ title, value }: StatProps) => {
  return (
    <Box
      width={"170px"}
      height={"100px"}
      background={"#F7BF7A"}
      display={"flex"}
      flexDir={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      gap={"10px"}
      borderRadius={"10px"}
    >
      <Text fontSize={"23px"}>{title}</Text>
      <Text fontSize={"19px"}>{value}</Text>
    </Box>
  );
};

const Profile = async ({ params }: { params: { userId: string } }) => {
  const [user, answers, questions] = await Promise.all([
    users.get<UserPrefs>(params.userId),
    databases.listDocuments(db, answerCollection, [
      Query.equal("authorId", params.userId),
      Query.limit(1),
    ]),
    databases.listDocuments(db, questionCollection, [
      Query.equal("authorId", params.userId),
      Query.limit(1),
    ]),
  ]);

  return (
    <Box width={{ base: "95%", sm: "95%", md: "60%", lg: "60%" }}>
      <Box display={"flex"} gap={"20px"} alignSelf={"flex-start"}>
        <Box
          background={"#FFCB72"}
          height={"100px"}
          width={"100px"}
          borderRadius={"10px"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          fontSize={"40px"}
        >
          <Text>
            {user?.name.split(" ")[0][0]}
            {user?.name.split(" ")[1] && user?.name.split(" ")[1][0]}
          </Text>
        </Box>
        <Box display={"flex"} flexDir={"column"} gap={"5px"}>
          <Text fontSize={"23px"}>{user?.name}</Text>
          <Text fontSize={"14px"}>
            Joined on {new Date(user?.$createdAt!).toDateString()}
          </Text>
        </Box>
        <Box marginLeft={"auto"} display={"flex"} gap={"10px"}>
          <StatCard title="Reputation" value={user?.prefs.reputation! | 0} />
          <StatCard title="Answers" value={answers.total} />
          <StatCard title="Questions" value={questions.total} />
        </Box>
      </Box>

      <ProfileTabs userId={params.userId} />
    </Box>
  );
};

export default Profile;
