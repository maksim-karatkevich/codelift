import { Box } from "@chakra-ui/core";
import { FunctionComponent } from "react";

export const Sidebar: FunctionComponent = ({ children }) => (
  <Box
    as="aside"
    bg="gray.700"
    display="flex"
    flexDirection="column"
    justifyContent="start"
    height="100vh"
    overflow="auto"
    shadow="inner"
  >
    {children}
  </Box>
);
