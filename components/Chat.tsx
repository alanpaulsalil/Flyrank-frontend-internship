"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { ProjectSpecCard } from "./ProjectSpecCard";
import { classifyChatError, getChatErrorCopy } from "@/lib/chat-errors";

const EXAMPLE_QUESTIONS = [
  "Tell me about your UVM verification environment",
  "Tell me about your APB-AHB bridge",
  "What's your background in verification?",
];

export function Chat() {
  const { messages, sendMessage, status, stop, error, regenerate } = useChat();
  const [input, setInput] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isPinnedToBottom = useRef(true);

  // Auto-scroll only while the user is already at the bottom.
  useEffect(() => {
    if (isPinnedToBottom.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Clear the "retrying" lock once the request has actually resolved
  // (either back to idle/ready, or into a new error state).
  useEffect(() => {
    if (status !== "submitted" && status !== "streaming") {
      setIsRetrying(false);
    }
  }, [status]);

  function handleScroll() {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    isPinnedToBottom.current = distanceFromBottom < 50;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
    isPinnedToBottom.current = true;
  }

  function handleExampleClick(question: string) {
    sendMessage({ text: question });
    isPinnedToBottom.current = true;
  }

  function handleRetry() {
    if (isRetrying) return; // guard against double-click
    setIsRetrying(true);
    regenerate();
  }

  const isStreaming = status === "streaming" || status === "submitted";
  const errorKind = classifyChatError(error);
  const errorCopy = error ? getChatErrorCopy(errorKind) : null;

  return (
    <div className="chat-container">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="chat-messages"
      >
        {messages.length === 0 && !isStreaming && (
          <div className="chat-empty-state">
            <p className="chat-empty-state__title">
              Ask me about Alan&apos;s verification work
            </p>
            <p className="chat-empty-state__subtitle">
              Try one of these to get started:
            </p>
            <div className="chat-empty-state__examples">
              {EXAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="chat-empty-state__example"
                  onClick={() => handleExampleClick(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message chat-message--${message.role}`}
          >
            <span className="chat-message__role">
              {message.role === "user" ? "You" : "Assistant"}
            </span>
            <div className="chat-message__text">
              {message.parts.map((part, i) => {
                if (part.type === "text") {
                  return <span key={i}>{part.text}</span>;
                }

                if (part.type === "tool-getProjectSpec") {
                  const callId = part.toolCallId;

                  switch (part.state) {
                    case "input-streaming":
                      return (
                        <div key={callId} className="tool-status tool-status--thinking">
                          <span className="tool-status__icon">⋯</span>
                          Deciding which project to look up...
                        </div>
                      );

                    case "input-available":
                      return (
                        <div key={callId} className="tool-status tool-status--loading">
                          <span className="tool-status__icon">⏳</span>
                          Looking up &quot;{(part.input as { project: string }).project}&quot;...
                        </div>
                      );

                    case "output-available":
                      return (
                        <ProjectSpecCard key={callId} spec={part.output as {
                          title: string;
                          description: string;
                          techStack: readonly string[];
                          highlights: readonly string[];
                          role: string;
                        }} />
                      );

                    case "output-error":
                      return (
                        <div key={callId} className="tool-status tool-status--error">
                          <span className="tool-status__icon">⚠</span>
                          {part.errorText}
                        </div>
                      );
                  }
                }

                return null;
              })}
            </div>
          </div>
        ))}

        {status === "submitted" && (
          <div className="chat-message chat-message--assistant">
            <span className="chat-message__role">Assistant</span>
            <div className="chat-thinking">
              <span className="chat-thinking__dot" />
              <span className="chat-thinking__dot" />
              <span className="chat-thinking__dot" />
            </div>
          </div>
        )}

        {error && errorCopy && (
          <div className={`chat-error-banner chat-error-banner--${errorKind}`}>
            <div className="chat-error-banner__text">
              <strong>{errorCopy.title}</strong>
              <span>{errorCopy.description}</span>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              disabled={isRetrying}
              className="chat-error-banner__retry"
            >
              {isRetrying ? "Retrying..." : "Retry"}
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Alan's verification work..."
          disabled={isStreaming}
          className="chat-input"
        />
        {isStreaming ? (
          <button type="button" onClick={stop} className="chat-stop-btn">
            Stop
          </button>
        ) : (
          <button type="submit" className="chat-send-btn">
            Send
          </button>
        )}
      </form>
    </div>
  );
}