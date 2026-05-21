import { NextResponse } from "next/server";
import { generateSpeech, isElevenLabsConfigured } from "@/lib/elevenlabs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = body?.text;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    if (!isElevenLabsConfigured()) {
      return NextResponse.json({
        demo: true,
        message: "Voice generation is running in demo mode.",
        fallback: "browser",
      });
    }

    const audioBuffer = await generateSpeech(text.trim());
    if (!audioBuffer) {
      return NextResponse.json({
        demo: true,
        message: "Voice generation is running in demo mode.",
        fallback: "browser",
      });
    }

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate voice" },
      { status: 500 }
    );
  }
}
