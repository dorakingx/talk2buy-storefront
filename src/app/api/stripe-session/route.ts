import { NextResponse } from "next/server";
import { getProductById } from "@/lib/products";
import { getStripe } from "@/lib/stripe";

export async function GET(request: Request) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "session_id is required" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    const productId = session.metadata?.productId ?? null;
    const product = productId ? getProductById(productId) : null;

    return NextResponse.json({
      customerName:
        session.metadata?.customerName ||
        session.customer_details?.name ||
        null,
      customerEmail: session.customer_details?.email ?? session.customer_email ?? null,
      productId,
      productName: product?.name ?? session.line_items?.data[0]?.description ?? null,
      paymentStatus: session.payment_status,
      userIntent: session.metadata?.userIntent ?? null,
    });
  } catch (e) {
    console.error("Stripe session retrieve error:", e);
    return NextResponse.json(
      { error: "Failed to retrieve session" },
      { status: 500 }
    );
  }
}
