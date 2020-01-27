import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Grid,
  useToast
} from "@chakra-ui/core";
import React, { FunctionComponent, useEffect, useState } from "react";
import { GitHub, HelpCircle } from "react-feather";
import { createClient, Provider } from "urql";

import { Selector } from "../Selector";
import { observer, useStore } from "../../store";
import { TreeInspector } from "../TreeInspector";
import { Error } from "./Error";
import { Sidebar } from "./Sidebar";
import { StyleInspector } from "../StyleInspector";

const client = createClient({ url: "/api" });

export const App: FunctionComponent = observer(() => {
  const store = useStore();
  // Only render the initial path to prevent double-reloads.
  const [initialPath] = useState(store.path);
  const toast = useToast();

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

  useEffect(() => {
    const { path } = store;

    window.history.pushState(
      {
        as: path,
        url: path
      },
      path,
      path
    );
  }, [store.path]);

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
          <footer className="order-last text-gray-300 flex font-thin bg-black items-center items-stretch">
            <a
              className="flex flex-grow items-center px-2 py-1 hover:text-white hover:bg-gray-800"
              href="https://github.com/ericclemmons/codelift"
            >
              code
              <small className="text-white font-normal italic underline pl-px">
                lift
              </small>
            </a>
            <a
              className="flex items-center px-2 py-1 hover:text-white hover:bg-gray-800"
              href="https://github.com/ericclemmons/codelift"
            >
              <GitHub className="current-color" size={13} />
            </a>
            <a
              className="flex items-center px-2 py-1 hover:text-white hover:bg-gray-800"
              href="https://github.com/ericclemmons/codelift/issues/new"
            >
              <HelpCircle className="current-color" size={13} />
            </a>
          </footer>

          <main className="flex-grow overflow-auto shadow-inner">
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
                  <CircularProgress
                    isIndeterminate
                    size="70%"
                    marginRight="2"
                  />
                  Loading
                </AlertTitle>
              </Alert>
            )}
          </main>
        </Sidebar>

        <Box as="main" boxShadow="lg" height="100vh" overflow="auto" zIndex={1}>
          <iframe
            onLoad={store.handleFrameLoad}
            src={`http://localhost:3000${initialPath}`}
            style={{ width: "100%", height: "100%" }}
            title="Source"
          />
        </Box>

        <Sidebar key="CSS">
          {store.selected?.isElement && <StyleInspector />}
        </Sidebar>
      </Grid>
    </Provider>
  );
});
