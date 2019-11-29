import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  CSSReset,
  Grid,
  Box,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  Link,
  List,
  ListItem,
  ListIcon,
  Text,
  Textarea,
  CircularProgress
} from "@chakra-ui/core";
import React, { FunctionComponent, useEffect, useCallback } from "react";
import { createClient, Provider } from "urql";

import { Error } from "./Error";
import { Selector } from "../Selector";
import { Sidebar } from "./Sidebar";
import { TreeInspector } from "../TreeInspector";
import { CSSInspector } from "../CSSInspector";
import { observer, useStore } from "../Store";

const client = createClient({ url: "/api" });

export const App: FunctionComponent = observer(() => {
  const store = useStore();

  const { href, origin } = window.location;
  const path = href.split(origin).pop();

  return (
    <Provider value={client}>
      {store.isOpen && <Selector />}

      <Grid gridTemplateColumns={store.root ? "16rem 1fr 16rem" : "16rem 1fr"}>
        <Sidebar>
          {store.root ? (
            <TreeInspector />
          ) : store.error ? (
            <Error />
          ) : (
            <Alert
              flexDirection="column"
              paddingY="4"
              status="info"
              variant="left-accent"
            >
              <AlertTitle color="white" fontSize="xl">
                <CircularProgress isIndeterminate size="70%" marginRight="2" />
                Loading
              </AlertTitle>
            </Alert>
          )}
        </Sidebar>

        <Box as="main" boxShadow="lg" height="100vh" overflow="auto">
          <iframe
            onLoad={store.handleFrameLoad}
            src={`http://localhost:3000${path}`}
            style={{ width: "100%", height: "100%" }}
            title="Source"
          />
        </Box>

        {store.root ? (
          <Sidebar>
            <CSSInspector />
          </Sidebar>
        ) : null}
      </Grid>
    </Provider>
  );
});