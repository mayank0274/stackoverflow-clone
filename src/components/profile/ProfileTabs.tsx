import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  TabIndicator,
} from "@chakra-ui/react";
import UserQuestionsList from "./UserQuestionsList";
import UserAnswersList from "./UserAnswersList";

type Props = {
  userId: string;
};

const ProfileTabs = ({ userId }: Props) => {
  return (
    <Box width={"100%"} my={"20px"}>
      <Tabs
        width={"100%"}
        position="relative"
        variant="unstyled"
        isFitted={true}
        isLazy={true}
      >
        <TabList width={"100%"}>
          <Tab>Questions</Tab>
          <Tab>Answers</Tab>
          <Tab>Comments</Tab>
        </TabList>
        <TabIndicator mt="-1.5px" height="2px" bg="orange" borderRadius="1px" />
        <TabPanels>
          <TabPanel>
            <UserQuestionsList userId={userId} />
          </TabPanel>
          <TabPanel>
            <UserAnswersList userId={userId} />
          </TabPanel>
          <TabPanel>
            <p>Comments</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ProfileTabs;
