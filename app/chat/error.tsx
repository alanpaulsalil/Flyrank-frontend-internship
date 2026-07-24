"use client";

import { useEffect } from "react";

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="chat-route-error">
      <div className="chat-route-error__panel">
        <h2 className="chat-route-error__title">Chat unavailable</h2>
        <p className="chat-route-error__description">
          Something unexpected happened while loading the chat. Your conversation
          history is safe — you can reload and try again.
        </p>
        <button type="button" onClick={reset} className="chat-route-error__btn">
          Try again
        </button>
      </div>
    </div>
  );
}
