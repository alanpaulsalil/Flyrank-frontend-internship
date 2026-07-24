export type ChatErrorKind = "network" | "rate_limit" | "generic";

type ParsedChatError = {
  code?: string;
  message?: string;
};

function tryParseChatErrorPayload(message: string): ParsedChatError | null {
  try {
    return JSON.parse(message) as ParsedChatError;
  } catch {
    return null;
  }
}

export function classifyChatError(error: Error | undefined): ChatErrorKind {
  if (!error) return "generic";

  const normalizedMessage = error.message.toLowerCase();

  if (
    error instanceof TypeError &&
    (normalizedMessage.includes("fetch") ||
      normalizedMessage.includes("network") ||
      normalizedMessage.includes("failed to fetch"))
  ) {
    return "network";
  }

  const parsed = tryParseChatErrorPayload(error.message);
  if (parsed?.code === "rate_limited") {
    return "rate_limit";
  }

  if (
    normalizedMessage.includes("rate_limited") ||
    normalizedMessage.includes("rate limit") ||
    normalizedMessage.includes("429")
  ) {
    return "rate_limit";
  }

  return "generic";
}

export function getChatErrorCopy(kind: ChatErrorKind): {
  title: string;
  description: string;
} {
  switch (kind) {
    case "network":
      return {
        title: "Connection problem",
        description:
          "We couldn't reach the server. Check your connection and try again.",
      };
    case "rate_limit":
      return {
        title: "Rate limited",
        description: "Too many requests right now. Try again shortly.",
      };
    default:
      return {
        title: "Something went wrong",
        description:
          "The assistant couldn't finish that response. Try again.",
      };
  }
}
