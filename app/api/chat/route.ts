import {
  streamText,
  convertToModelMessages,
  UIMessage,
  tool,
  stepCountIs,
} from "ai";
import z from "zod";
import { groq } from "@ai-sdk/groq";
import { PrismaClient } from "@prisma/client";

import { dbSchema } from "@/lib/constants";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import { isSafeSQLQuery } from "@/lib/utils";

export const maxDuration = 30;
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  try {
    const result = await streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: SYSTEM_PROMPT,
      stopWhen: stepCountIs(5),
      messages: convertToModelMessages(messages),

      onError: ({ error }) => {
        console.error("Stream error:", error);
      },

      tools: {
        queryBuilder: tool({
          description: "Provides database schema information",
          inputSchema: z.object({}),
          outputSchema: z.object({ schema: z.string() }),
          execute: async () => {
            console.log("🧠 queryBuilder called with:");
            return { schema: dbSchema };
          },
        }),

        db: tool({
          description: "Execute a generated SQL query and return data",
          inputSchema: z.object({
            sqlQuery: z.string(),
          }),
          execute: async ({ sqlQuery }) => {
            console.log("🧩 generated query:", sqlQuery);
            const cleanQuery = sqlQuery.replace(/\\"/g, '"').trim();

            if (!isSafeSQLQuery(cleanQuery)) {
              throw new Error("Unsafe SQL query blocked.");
            }

            try {
              const result = await prisma.$queryRawUnsafe(cleanQuery);
              const safeResult = JSON.parse(
                JSON.stringify(result, (_k, v) =>
                  typeof v === "bigint" ? v.toString() : v
                )
              );
              return { rows: safeResult };
            } catch (err) {
              console.error("❌ Database query failed:", err);
              // Rethrow a *specific* error so frontend can detect it
              throw new Error("DatabaseError: Unable to execute query.");
            }
          },
        }),
      },
    });
    for await (const part of result.fullStream) {
      switch (part.type) {
        // ... handle other part types

        case "error": {
          const error = part.error;
          // handle error
          console.log("General error", error);
          throw new Error("There is some issue!");
          break;
        }

        case "abort": {
          // handle stream abort
          console.log("abort error");
          throw new Error("Abort error!");
          break;
        }

        case "tool-error": {
          const error = part.error;
          // handle error
          console.log("Tool Error: ", error);
          throw new Error(`Failed to complete a step!`);
          break;
        }
      }
    }

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("🔥 Fatal error:", error);

    return new Response(
      JSON.stringify({
        error: "Sorry, something went wrong while processing your request.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
