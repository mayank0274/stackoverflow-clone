import { Box, Center, Spinner } from "@chakra-ui/react";
import React from "react";

type Props = {};

const loading = (props: Props) => {
  return (
    <Box>
      <Center>
        <Spinner size={"lg"} />
      </Center>
    </Box>
  );
};

export default loading;
