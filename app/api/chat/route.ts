import { groq } from "@ai-sdk/groq";
import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  type UIMessage,
} from "ai";

// Keep model config and system prompt here, in one place, per the assignment brief.
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are a helpful assistant embedded on Alan Paul Salil's
portfolio site. Alan is a 3rd year B.Tech ECE student specializing in VLSI,
focused on digital design verification using SystemVerilog and UVM.

He has built:
- A complete UVM verification environment (generator, driver, monitor,
  scoreboard, environment, interface, transactions) with coverage groups
  and assertions.
- An APB-AHB protocol bridge design.

Answer visitor questions about Alan's verification work, skills, and
background factually and concisely, based only on the information above.
If asked something you don't know about Alan, say so honestly rather than
making details up.`;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: groq(MODEL),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}