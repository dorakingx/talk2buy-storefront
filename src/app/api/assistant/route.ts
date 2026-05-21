import { NextResponse } from "next/server";
import { getAssistantReply } from "@/lib/assistant";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body?.message;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 }
      );
    }

    const result = await getAssistantReply(message.trim());
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to process assistant request" },
      { status: 500 }
    );
  }
}
