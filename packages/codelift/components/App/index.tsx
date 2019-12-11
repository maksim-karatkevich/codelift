import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Grid,
  useToast
} from "@chakra-ui/core";
import React, { FunctionComponent, useEffect } from "react";
import { createClient, Provider } from "urql";

import { CSSInspector } from "../CSSInspector";
import { Selector } from "../Selector";
import { observer, useStore } from "../../store";
import { TreeInspector } from "../TreeInspector";
import { Error } from "./Error";
import { Sidebar } from "./Sidebar";

const client = createClient({ url: "/api" });

export const App: FunctionComponent = observer(() => {
  const store = useStore();
  const toast = useToast();
  const { href, origin } = window.location;
  const path = href.split(origin).pop();

  useEffect(() => {
    if (store.state === "HIDDEN") {
      toast({
        description: "Press ⌘+' to re-open",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
        status: "info",
        title: "Codelift hidden"
      });
    }
  }, [store.state]);

  return (
    <Provider value={client}>
      {store.state === "VISIBLE" && <Selector />}

      <Grid
        gridTemplateColumns={`${store.state === "VISIBLE" ? "16rem" : 0} 1fr ${
          store.state === "VISIBLE" ? "16rem" : 0
        }`}
        style={{ transition: "all 200ms ease-in-out" }}
      >
        <Sidebar key="Tree">
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

        <Box as="main" boxShadow="lg" height="100vh" overflow="auto" zIndex={1}>
          <iframe
            onLoad={store.handleFrameLoad}
            src={`http://localhost:3000${path}`}
            style={{ width: "100%", height: "100%" }}
            title="Source"
          />
        </Box>

        <Sidebar key="CSS">
          <CSSInspector />
        </Sidebar>
      </Grid>
    </Provider>
  );
});
