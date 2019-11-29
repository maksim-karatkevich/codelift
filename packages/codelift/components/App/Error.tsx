import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Textarea,
  useClipboard,
  Button
} from "@chakra-ui/core";
import { FunctionComponent } from "react";
import { observer, useStore } from "../Store";

const code = `
if (process.env.NODE_ENV === "development" && typeof window === "object") {
  // Allow access from GUI on another port
  document.domain = window.location.hostname;
}`.trim();

export const Error: FunctionComponent = observer(() => {
  const store = useStore();
  const { onCopy, hasCopied } = useClipboard(code);

  if (!store.error) {
    return null;
  }

  return (
    <Alert
      color="white"
      flexDirection="column"
      status="warning"
      variant="left-accent"
    >
      <AlertIcon />
      <AlertTitle fontSize="lg" marginY="2" textAlign="center" textShadow="sm">
        {store.error.message}
      </AlertTitle>
      <AlertDescription fontWeight="normal" marginY="2" textAlign="center">
        Add this to the top of your app:
      </AlertDescription>
      <Textarea
        bg="black"
        fontSize="xs"
        fontFamily="mono"
        height="5rem"
        opacity={0.5}
        padding="2"
        overflow="auto"
        resize="none"
        rounded="md"
        roundedBottom="none"
        whiteSpace="pre"
        width="full"
      >
        {code}
      </Textarea>
      <Button
        leftIcon={hasCopied ? "check-circle" : "copy"}
        onClick={onCopy}
        size="sm"
        variantColor="green"
        width="full"
        roundedTop="none"
      >
        {hasCopied ? "Copied!" : "Copy"}
      </Button>
    </Alert>
  );
});
