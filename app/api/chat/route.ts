import { groq } from "@ai-sdk/groq";
import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { getProjectSpec } from "@/lib/tools";
import {
  shouldSimulateRateLimit,
  shouldSimulateMidStreamError,
} from "@/lib/chat-test-triggers";

// Keep model config and system prompt here, in one place, per the assignment brief.
const MODEL = "llama-3.3-70b-versatile";
const SYSTEM_PROMPT = `You are a helpful assistant embedded on Alan Paul Salil's
portfolio site. Alan is a 3rd year B.Tech ECE student specializing in VLSI,
focused on digital design verification using SystemVerilog and UVM.

Whenever a visitor asks about any specific project by name — whether or
not you recognize it — you must call the getProjectSpec tool to check.
Do not decide from memory whether a project exists; let the tool's result
determine that. Only say you don't have information about a project after
the tool has returned an error for it.

For general questions about Alan's background or skills that aren't about
a specific project's technical details, answer briefly and factually based
only on the summary above. If asked about something you don't know, say so
honestly rather than making details up.`;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // TEST-ONLY: simulate failure states for the resilience checkpoint.
  // Gated behind ENABLE_CHAT_TEST_TRIGGERS so these can't fire in normal use.
  if (shouldSimulateRateLimit(messages)) {
    return new Response(
      JSON.stringify({
        code: "rate_limited",
        message: "Rate limit exceeded (test trigger).",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  if (shouldSimulateMidStreamError(messages)) {
    throw new Error("Simulated mid-stream failure (test trigger).");
  }

  const result = streamText({
    model: groq(MODEL),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: {
      getProjectSpec,
    },
  });
  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: (error) => {
        if (error instanceof Error) return error.message;
        return "An unexpected error occurred.";
      },
    }),
  });
}