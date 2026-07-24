import type { UIMessage } from "ai";

/**
 * Test-only chat failure triggers.
 * Both ENABLE_CHAT_TEST_TRIGGERS=true and an exact phrase below are required,
 * so these paths cannot fire in production by accident.
 */
export const CHAT_TEST_STREAM_ERROR_TRIGGER = "__dev_trigger_stream_error__";
export const CHAT_TEST_RATE_LIMIT_TRIGGER = "__dev_trigger_rate_limit__";

export function isChatTestTriggersEnabled(): boolean {
  return process.env.ENABLE_CHAT_TEST_TRIGGERS === "true";
}

export function getLastUserMessageText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.role !== "user") continue;

    return message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("");
  }

  return "";
}

export function shouldSimulateRateLimit(messages: UIMessage[]): boolean {
  if (!isChatTestTriggersEnabled()) return false;
  return getLastUserMessageText(messages).includes(
    CHAT_TEST_RATE_LIMIT_TRIGGER
  );
}

export function shouldSimulateMidStreamError(messages: UIMessage[]): boolean {
  if (!isChatTestTriggersEnabled()) return false;
  return getLastUserMessageText(messages).includes(
    CHAT_TEST_STREAM_ERROR_TRIGGER
  );
}
